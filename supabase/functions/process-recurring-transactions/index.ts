// supabase/functions/process-recurring-transactions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const today = new Date().toISOString().split("T")[0];

    // Find due recurring transactions
    const { data: dueItems, error: fetchError } = await supabase
      .from("recurring_transactions")
      .select("*")
      .eq("is_active", true)
      .eq("auto_create", true)
      .lte("next_run_date", today);

    if (fetchError) throw fetchError;

    const results = [];

    for (const item of dueItems || []) {
      // Create transaction
      const { data: newTx, error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: item.user_id,
          account_id: item.account_id,
          category_id: item.category_id,
          transaction_type: item.transaction_type,
          amount: item.amount,
          currency_code: item.currency_code,
          title: item.title,
          merchant: item.merchant,
          payment_method: item.payment_method,
          transaction_date: today,
          status: "completed",
        })
        .select()
        .single();

      if (!txError && newTx) {
        // Log recurring run
        await supabase.from("recurring_transaction_runs").insert({
          user_id: item.user_id,
          recurring_transaction_id: item.id,
          transaction_id: newTx.id,
          scheduled_for: today,
          status: "created",
        });

        // Compute next run date
        const nextDate = new Date(item.next_run_date);
        if (item.frequency === "daily") nextDate.setDate(nextDate.getDate() + item.interval_value);
        else if (item.frequency === "weekly") nextDate.setDate(nextDate.getDate() + 7 * item.interval_value);
        else if (item.frequency === "monthly") nextDate.setMonth(nextDate.getMonth() + item.interval_value);
        else if (item.frequency === "yearly") nextDate.setFullYear(nextDate.getFullYear() + item.interval_value);

        await supabase
          .from("recurring_transactions")
          .update({
            last_run_at: new Date().toISOString(),
            next_run_date: nextDate.toISOString().split("T")[0],
          })
          .eq("id", item.id);

        results.push({ id: item.id, status: "created", transaction_id: newTx.id });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, details: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
