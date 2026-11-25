-- 202611250012_create_views.sql
create or replace view public.account_balances
with (security_invoker = true)
as
select
  a.id as account_id,
  a.user_id,
  a.name as account_name,
  a.account_type,
  a.currency_code,
  a.opening_balance,
  a.include_in_total,
  a.is_active,
  (
    a.opening_balance + coalesce(ledger.net_change, 0)
  )::numeric(20,2) as current_balance
from public.accounts a
left join lateral (
  select sum(entries.delta) as net_change
  from (
    select
      case
        when t.transaction_type = 'income' then t.amount
        else -t.amount
      end as delta
    from public.transactions t
    where t.account_id = a.id
      and t.user_id = a.user_id
      and t.status = 'completed'

    union all

    select
      case
        when tr.from_account_id = a.id then -tr.amount
        else tr.amount
      end as delta
    from public.account_transfers tr
    where tr.user_id = a.user_id
      and tr.status = 'completed'
      and (tr.from_account_id = a.id or tr.to_account_id = a.id)
  ) entries
) ledger on true;

create or replace view public.monthly_cash_flow
with (security_invoker = true)
as
select
  user_id,
  date_trunc('month', transaction_date)::date as month_start,
  coalesce(sum(amount) filter (where transaction_type = 'income'), 0)::numeric(20,2) as total_income,
  coalesce(sum(amount) filter (where transaction_type = 'expense'), 0)::numeric(20,2) as total_expense,
  (
    coalesce(sum(amount) filter (where transaction_type = 'income'), 0)
    - coalesce(sum(amount) filter (where transaction_type = 'expense'), 0)
  )::numeric(20,2) as net_cash_flow
from public.transactions
where status = 'completed'
group by user_id, date_trunc('month', transaction_date)::date;

create or replace view public.monthly_category_spend
with (security_invoker = true)
as
select
  t.user_id,
  date_trunc('month', t.transaction_date)::date as month_start,
  t.category_id,
  coalesce(c.name, 'Uncategorized') as category_name,
  c.icon,
  c.color,
  sum(t.amount)::numeric(20,2) as total_spend
from public.transactions t
left join public.categories c on c.id = t.category_id and c.user_id = t.user_id
where t.status = 'completed' and t.transaction_type = 'expense'
group by t.user_id, date_trunc('month', t.transaction_date)::date, t.category_id, c.name, c.icon, c.color;

create or replace view public.budget_progress
with (security_invoker = true)
as
select
  b.id as budget_id,
  b.user_id,
  b.name as budget_name,
  b.period_type,
  b.period_start,
  b.period_end,
  b.total_amount as total_budget,
  coalesce(spent.total_spent, 0)::numeric(20,2) as total_spent,
  greatest(b.total_amount - coalesce(spent.total_spent, 0), 0)::numeric(20,2) as remaining_amount,
  case
    when b.total_amount = 0 then 0
    else round((coalesce(spent.total_spent, 0) / b.total_amount) * 100, 2)
  end as percentage_used
from public.budgets b
left join lateral (
  select sum(t.amount) as total_spent
  from public.transactions t
  where t.user_id = b.user_id
    and t.transaction_type = 'expense'
    and t.status = 'completed'
    and t.currency_code = b.currency_code
    and t.transaction_date between b.period_start and b.period_end
) spent on true;

create or replace view public.savings_goal_progress
with (security_invoker = true)
as
select
  g.id as goal_id,
  g.user_id,
  g.name as goal_name,
  g.target_amount,
  coalesce(
    sum(
      case
        when tr.goal_action = 'contribution' then tr.amount
        when tr.goal_action = 'withdrawal' then -tr.amount
        else 0
      end
    ) filter (where tr.status = 'completed'),
    0
  )::numeric(20,2) as current_saved,
  greatest(
    g.target_amount - coalesce(
      sum(
        case
          when tr.goal_action = 'contribution' then tr.amount
          when tr.goal_action = 'withdrawal' then -tr.amount
          else 0
        end
      ) filter (where tr.status = 'completed'),
      0
    ),
    0
  )::numeric(20,2) as remaining_amount,
  case
    when g.target_amount = 0 then 0
    else round((coalesce(sum(case when tr.goal_action = 'contribution' then tr.amount else -tr.amount end) filter (where tr.status = 'completed'), 0) / g.target_amount) * 100, 2)
  end as percentage_completed,
  g.status,
  g.target_date
from public.savings_goals g
left join public.account_transfers tr on tr.goal_id = g.id and tr.user_id = g.user_id
group by g.id, g.user_id, g.name, g.target_amount, g.status, g.target_date;
