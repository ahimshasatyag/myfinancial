export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TransactionType = 'income' | 'expense';
export type AccountType = 'cash' | 'bank' | 'e_wallet' | 'credit_card' | 'investment' | 'other';
export type PaymentMethod = 'cash' | 'debit_card' | 'credit_card' | 'bank_transfer' | 'qris' | 'e_wallet' | 'other';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';
export type GoalTransferAction = 'contribution' | 'withdrawal';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringRunStatus = 'created' | 'skipped' | 'failed';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          theme: ThemeMode;
          preferred_currency: string;
          timezone: string;
          language_code: string;
          week_starts_on: number;
          hide_balances: boolean;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: ThemeMode;
          preferred_currency?: string;
          timezone?: string;
          language_code?: string;
          week_starts_on?: number;
          hide_balances?: boolean;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: ThemeMode;
          preferred_currency?: string;
          timezone?: string;
          language_code?: string;
          week_starts_on?: number;
          hide_balances?: boolean;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          account_type: AccountType;
          institution_name: string | null;
          account_number_last4: string | null;
          currency_code: string;
          opening_balance: number;
          icon: string | null;
          color: string | null;
          notes: string | null;
          is_active: boolean;
          include_in_total: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          account_type: AccountType;
          institution_name?: string | null;
          account_number_last4?: string | null;
          currency_code?: string;
          opening_balance?: number;
          icon?: string | null;
          color?: string | null;
          notes?: string | null;
          is_active?: boolean;
          include_in_total?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          account_type?: AccountType;
          institution_name?: string | null;
          account_number_last4?: string | null;
          currency_code?: string;
          opening_balance?: number;
          icon?: string | null;
          color?: string | null;
          notes?: string | null;
          is_active?: boolean;
          include_in_total?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          parent_id: string | null;
          name: string;
          transaction_type: TransactionType;
          icon: string | null;
          color: string | null;
          description: string | null;
          is_default: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          parent_id?: string | null;
          name: string;
          transaction_type: TransactionType;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          parent_id?: string | null;
          name?: string;
          transaction_type?: TransactionType;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string | null;
          transaction_type: TransactionType;
          amount: number;
          currency_code: string;
          title: string;
          merchant: string | null;
          payment_method: PaymentMethod | null;
          transaction_date: string;
          transaction_time: string | null;
          reference_number: string | null;
          description: string | null;
          notes: string | null;
          status: TransactionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id?: string | null;
          transaction_type: TransactionType;
          amount: number;
          currency_code?: string;
          title: string;
          merchant?: string | null;
          payment_method?: PaymentMethod | null;
          transaction_date?: string;
          transaction_time?: string | null;
          reference_number?: string | null;
          description?: string | null;
          notes?: string | null;
          status?: TransactionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string | null;
          transaction_type?: TransactionType;
          amount?: number;
          currency_code?: string;
          title?: string;
          merchant?: string | null;
          payment_method?: PaymentMethod | null;
          transaction_date?: string;
          transaction_time?: string | null;
          reference_number?: string | null;
          description?: string | null;
          notes?: string | null;
          status?: TransactionStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      account_transfers: {
        Row: {
          id: string;
          user_id: string;
          from_account_id: string;
          to_account_id: string;
          goal_id: string | null;
          goal_action: GoalTransferAction | null;
          amount: number;
          currency_code: string;
          transfer_date: string;
          transfer_time: string | null;
          reference_number: string | null;
          description: string | null;
          notes: string | null;
          status: TransactionStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          from_account_id: string;
          to_account_id: string;
          goal_id?: string | null;
          goal_action?: GoalTransferAction | null;
          amount: number;
          currency_code?: string;
          transfer_date?: string;
          transfer_time?: string | null;
          reference_number?: string | null;
          description?: string | null;
          notes?: string | null;
          status?: TransactionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          from_account_id?: string;
          to_account_id?: string;
          goal_id?: string | null;
          goal_action?: GoalTransferAction | null;
          amount?: number;
          currency_code?: string;
          transfer_date?: string;
          transfer_time?: string | null;
          reference_number?: string | null;
          description?: string | null;
          notes?: string | null;
          status?: TransactionStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          target_amount: number;
          currency_code: string;
          target_date: string | null;
          status: GoalStatus;
          icon: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          target_amount: number;
          currency_code?: string;
          target_date?: string | null;
          status?: GoalStatus;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          target_amount?: number;
          currency_code?: string;
          target_date?: string | null;
          status?: GoalStatus;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string | null;
          transaction_type: TransactionType;
          amount: number;
          currency_code: string;
          title: string;
          merchant: string | null;
          payment_method: PaymentMethod | null;
          description: string | null;
          frequency: RecurrenceFrequency;
          interval_value: number;
          start_date: string;
          end_date: string | null;
          next_run_date: string;
          last_run_at: string | null;
          is_active: boolean;
          auto_create: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id?: string | null;
          transaction_type: TransactionType;
          amount: number;
          currency_code?: string;
          title: string;
          merchant?: string | null;
          payment_method?: PaymentMethod | null;
          description?: string | null;
          frequency: RecurrenceFrequency;
          interval_value?: number;
          start_date: string;
          end_date?: string | null;
          next_run_date: string;
          last_run_at?: string | null;
          is_active?: boolean;
          auto_create?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string | null;
          transaction_type?: TransactionType;
          amount?: number;
          currency_code?: string;
          title?: string;
          merchant?: string | null;
          payment_method?: PaymentMethod | null;
          description?: string | null;
          frequency?: RecurrenceFrequency;
          interval_value?: number;
          start_date?: string;
          end_date?: string | null;
          next_run_date?: string;
          last_run_at?: string | null;
          is_active?: boolean;
          auto_create?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      recurring_transaction_runs: {
        Row: {
          id: string;
          user_id: string;
          recurring_transaction_id: string;
          transaction_id: string | null;
          scheduled_for: string;
          status: RecurringRunStatus;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recurring_transaction_id: string;
          transaction_id?: string | null;
          scheduled_for: string;
          status?: RecurringRunStatus;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recurring_transaction_id?: string;
          transaction_id?: string | null;
          scheduled_for?: string;
          status?: RecurringRunStatus;
          error_message?: string | null;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      transaction_tags: {
        Row: {
          id: string;
          user_id: string;
          transaction_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_id?: string;
          tag_id?: string;
          created_at?: string;
        };
      };
      transaction_attachments: {
        Row: {
          id: string;
          user_id: string;
          transaction_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          transaction_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          transaction_id?: string;
          storage_path?: string;
          file_name?: string;
          mime_type?: string;
          size_bytes?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      account_balances: {
        Row: {
          account_id: string;
          user_id: string;
          account_name: string;
          account_type: AccountType;
          currency_code: string;
          opening_balance: number;
          include_in_total: boolean;
          is_active: boolean;
          current_balance: number;
        };
      };
      monthly_cash_flow: {
        Row: {
          user_id: string;
          month_start: string;
          total_income: number;
          total_expense: number;
          net_cash_flow: number;
        };
      };
      monthly_category_spend: {
        Row: {
          user_id: string;
          month_start: string;
          category_id: string;
          category_name: string;
          icon: string | null;
          color: string | null;
          total_spend: number;
        };
      };
      savings_goal_progress: {
        Row: {
          goal_id: string;
          user_id: string;
          goal_name: string;
          target_amount: number;
          current_saved: number;
          remaining_amount: number;
          percentage_completed: number;
          status: GoalStatus;
          target_date: string | null;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];
export type Account = Database['public']['Tables']['accounts']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type AccountTransfer = Database['public']['Tables']['account_transfers']['Row'];
export type SavingsGoal = Database['public']['Tables']['savings_goals']['Row'];
export type RecurringTransaction = Database['public']['Tables']['recurring_transactions']['Row'];
export type AccountBalanceView = Database['public']['Views']['account_balances']['Row'];
export type SavingsGoalProgressView = Database['public']['Views']['savings_goal_progress']['Row'];
