create extension if not exists pgcrypto;

create type account_type as enum (
  'checking',
  'savings',
  'credit_card',
  'taxable_brokerage',
  'robo_investor',
  'crypto',
  '401k',
  '457b',
  'ira',
  'hsa',
  'pension',
  'mortgage',
  'student_loan',
  'personal_loan',
  'property',
  'other_asset',
  'other_liability'
);

create type account_group as enum (
  'cash',
  'taxable_investments',
  'retirement',
  'hsa',
  'crypto',
  'property',
  'debt',
  'credit_cards',
  'other'
);

create type account_status as enum ('active', 'closed', 'archived');

create type liquidity_class as enum (
  'operating_cash',
  'emergency_cash',
  'invested_accessible',
  'volatile_asset',
  'retirement_restricted',
  'tax_advantaged_health',
  'debt',
  'other'
);

create type risk_class as enum (
  'none',
  'low',
  'moderate',
  'high',
  'volatile',
  'debt'
);

create type tracking_method as enum (
  'manual_balance',
  'manual_full',
  'csv_import',
  'full_sync',
  'balance_sync',
  'transaction_sync',
  'holdings_sync',
  'statement_upload',
  'unsupported'
);

create type sync_status as enum (
  'manual',
  'syncing',
  'sync_error',
  'balance_only',
  'transaction_only',
  'holdings_only',
  'full_sync',
  'unsupported'
);

create type transaction_type as enum (
  'income',
  'true_expense',
  'transfer',
  'internal_payment',
  'investment_contribution',
  'investment_withdrawal',
  'debt_payment',
  'refund',
  'reimbursement',
  'fee',
  'interest',
  'dividend',
  'uncategorized'
);

create type transfer_match_status as enum ('pending', 'approved', 'rejected');

create type data_quality_status as enum (
  'excellent',
  'good',
  'partial',
  'poor',
  'manual',
  'unsupported',
  'unknown'
);

create type document_type as enum (
  'bank_statement',
  'credit_card_statement',
  'brokerage_statement',
  'retirement_statement',
  'hsa_statement',
  'loan_statement',
  'mortgage_statement',
  'crypto_statement',
  'other'
);

create type review_status as enum (
  'pending',
  'approved',
  'edited',
  'rejected',
  'ignored'
);

create type provider_connection_status as enum (
  'connected',
  'partial',
  'reauthorization_required',
  'manual_only',
  'unsupported'
);

create type import_job_status as enum (
  'draft',
  'mapped',
  'reviewing',
  'completed',
  'failed'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table institutions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table data_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider_key text not null,
  provider_kind text not null default 'mock',
  is_enabled boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider_key)
);

create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references institutions(id) on delete set null,
  name text not null,
  masked_identifier text,
  account_type account_type not null,
  account_group account_group not null,
  account_status account_status not null default 'active',
  liquidity_class liquidity_class not null default 'other',
  risk_class risk_class not null default 'none',
  tracking_method tracking_method not null default 'manual_balance',
  sync_status sync_status not null default 'manual',
  data_quality_status data_quality_status not null default 'manual',
  include_in_net_worth boolean not null default true,
  include_in_cash_flow boolean not null default true,
  opened_on date,
  closed_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table account_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  data_provider_id uuid not null references data_providers(id) on delete cascade,
  connection_status provider_connection_status not null default 'manual_only',
  last_successful_sync_at timestamptz,
  current_balance_available boolean not null default false,
  transactions_available boolean not null default false,
  transaction_history_months integer not null default 0,
  category_data_available boolean not null default false,
  merchant_data_available boolean not null default false,
  holdings_available boolean not null default false,
  investment_transactions_available boolean not null default false,
  contribution_withdrawal_data_available boolean not null default false,
  webhook_refresh_supported boolean not null default false,
  reauthentication_required boolean not null default false,
  sync_errors jsonb not null default '[]'::jsonb,
  recommended_tracking_method tracking_method not null default 'manual_balance',
  data_quality_status data_quality_status not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, data_provider_id)
);

create table account_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  balance_date date not null,
  balance_amount numeric(14, 2) not null,
  currency text not null default 'USD',
  source tracking_method not null default 'manual_balance',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, balance_date)
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  transaction_type transaction_type not null default 'uncategorized',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  transaction_date date not null,
  posted_date date,
  description text not null,
  merchant text,
  amount numeric(14, 2) not null,
  currency text not null default 'USD',
  transaction_type transaction_type not null default 'uncategorized',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table transaction_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  match_text text not null,
  transaction_type transaction_type not null,
  category_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table transfer_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_transaction_id uuid not null references transactions(id) on delete cascade,
  matched_transaction_id uuid references transactions(id) on delete cascade,
  confidence_score integer not null check (
    confidence_score >= 0
    and confidence_score <= 100
  ),
  suggested_transaction_type transaction_type not null default 'transfer',
  suggested_category_id uuid references categories(id) on delete set null,
  match_reason text not null,
  status transfer_match_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  as_of_date date not null,
  symbol text,
  name text not null,
  quantity numeric(18, 6),
  market_value numeric(14, 2) not null,
  currency text not null default 'USD',
  source tracking_method not null default 'manual_balance',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table investment_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  activity_date date not null,
  transaction_id uuid references transactions(id) on delete set null,
  activity_type transaction_type not null,
  amount numeric(14, 2) not null,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table monthly_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  net_worth numeric(14, 2),
  total_assets numeric(14, 2),
  total_liabilities numeric(14, 2),
  income numeric(14, 2),
  true_expenses numeric(14, 2),
  debt_payments numeric(14, 2),
  free_cash_flow numeric(14, 2),
  investment_contributions numeric(14, 2),
  estimated_investment_growth numeric(14, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_start)
);

create table monthly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  report_sections jsonb not null default '{}'::jsonb,
  action_items jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month_start)
);

create table import_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  import_source tracking_method not null,
  status import_job_status not null default 'draft',
  source_file_name text,
  mapping jsonb not null default '{}'::jsonb,
  row_count integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table uploaded_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references accounts(id) on delete set null,
  document_type document_type not null,
  statement_period_start date not null,
  statement_period_end date not null,
  file_name text not null,
  storage_path text,
  review_status review_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (statement_period_end >= statement_period_start)
);

create table document_extractions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  uploaded_document_id uuid not null references uploaded_documents(id) on delete cascade,
  extractor_type text not null default 'mock',
  extraction_status review_status not null default 'pending',
  extracted_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table extracted_statement_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_extraction_id uuid not null references document_extractions(id) on delete cascade,
  item_type text not null,
  label text not null,
  extracted_value text not null,
  normalized_value numeric(14, 2),
  review_status review_status not null default 'pending',
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index institutions_user_id_idx on institutions (user_id);
create index accounts_user_id_idx on accounts (user_id);
create index accounts_institution_id_idx on accounts (institution_id);
create index account_balances_account_date_idx on account_balances (account_id, balance_date desc);
create index transactions_account_date_idx on transactions (account_id, transaction_date desc);
create index transfer_matches_user_status_idx on transfer_matches (user_id, status);
create index uploaded_documents_user_status_idx on uploaded_documents (user_id, review_status);

create trigger profiles_set_updated_at
before update on profiles
for each row execute function public.set_updated_at();

create trigger institutions_set_updated_at
before update on institutions
for each row execute function public.set_updated_at();

create trigger data_providers_set_updated_at
before update on data_providers
for each row execute function public.set_updated_at();

create trigger accounts_set_updated_at
before update on accounts
for each row execute function public.set_updated_at();

create trigger account_connections_set_updated_at
before update on account_connections
for each row execute function public.set_updated_at();

create trigger account_balances_set_updated_at
before update on account_balances
for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
before update on categories
for each row execute function public.set_updated_at();

create trigger transactions_set_updated_at
before update on transactions
for each row execute function public.set_updated_at();

create trigger transaction_rules_set_updated_at
before update on transaction_rules
for each row execute function public.set_updated_at();

create trigger transfer_matches_set_updated_at
before update on transfer_matches
for each row execute function public.set_updated_at();

create trigger holdings_set_updated_at
before update on holdings
for each row execute function public.set_updated_at();

create trigger investment_activity_set_updated_at
before update on investment_activity
for each row execute function public.set_updated_at();

create trigger monthly_snapshots_set_updated_at
before update on monthly_snapshots
for each row execute function public.set_updated_at();

create trigger monthly_reports_set_updated_at
before update on monthly_reports
for each row execute function public.set_updated_at();

create trigger import_jobs_set_updated_at
before update on import_jobs
for each row execute function public.set_updated_at();

create trigger uploaded_documents_set_updated_at
before update on uploaded_documents
for each row execute function public.set_updated_at();

create trigger document_extractions_set_updated_at
before update on document_extractions
for each row execute function public.set_updated_at();

create trigger extracted_statement_items_set_updated_at
before update on extracted_statement_items
for each row execute function public.set_updated_at();

alter table profiles enable row level security;
alter table institutions enable row level security;
alter table data_providers enable row level security;
alter table accounts enable row level security;
alter table account_connections enable row level security;
alter table account_balances enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table transaction_rules enable row level security;
alter table transfer_matches enable row level security;
alter table holdings enable row level security;
alter table investment_activity enable row level security;
alter table monthly_snapshots enable row level security;
alter table monthly_reports enable row level security;
alter table import_jobs enable row level security;
alter table uploaded_documents enable row level security;
alter table document_extractions enable row level security;
alter table extracted_statement_items enable row level security;

create policy profiles_select_own on profiles
for select to authenticated using ((select auth.uid()) = user_id);
create policy profiles_insert_own on profiles
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy profiles_update_own on profiles
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy profiles_delete_own on profiles
for delete to authenticated using ((select auth.uid()) = user_id);

create policy institutions_select_own on institutions
for select to authenticated using ((select auth.uid()) = user_id);
create policy institutions_insert_own on institutions
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy institutions_update_own on institutions
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy institutions_delete_own on institutions
for delete to authenticated using ((select auth.uid()) = user_id);

create policy data_providers_select_own on data_providers
for select to authenticated using ((select auth.uid()) = user_id);
create policy data_providers_insert_own on data_providers
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy data_providers_update_own on data_providers
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy data_providers_delete_own on data_providers
for delete to authenticated using ((select auth.uid()) = user_id);

create policy accounts_select_own on accounts
for select to authenticated using ((select auth.uid()) = user_id);
create policy accounts_insert_own on accounts
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy accounts_update_own on accounts
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy accounts_delete_own on accounts
for delete to authenticated using ((select auth.uid()) = user_id);

create policy account_connections_select_own on account_connections
for select to authenticated using ((select auth.uid()) = user_id);
create policy account_connections_insert_own on account_connections
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy account_connections_update_own on account_connections
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy account_connections_delete_own on account_connections
for delete to authenticated using ((select auth.uid()) = user_id);

create policy account_balances_select_own on account_balances
for select to authenticated using ((select auth.uid()) = user_id);
create policy account_balances_insert_own on account_balances
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy account_balances_update_own on account_balances
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy account_balances_delete_own on account_balances
for delete to authenticated using ((select auth.uid()) = user_id);

create policy categories_select_own on categories
for select to authenticated using ((select auth.uid()) = user_id);
create policy categories_insert_own on categories
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy categories_update_own on categories
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy categories_delete_own on categories
for delete to authenticated using ((select auth.uid()) = user_id);

create policy transactions_select_own on transactions
for select to authenticated using ((select auth.uid()) = user_id);
create policy transactions_insert_own on transactions
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy transactions_update_own on transactions
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy transactions_delete_own on transactions
for delete to authenticated using ((select auth.uid()) = user_id);

create policy transaction_rules_select_own on transaction_rules
for select to authenticated using ((select auth.uid()) = user_id);
create policy transaction_rules_insert_own on transaction_rules
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy transaction_rules_update_own on transaction_rules
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy transaction_rules_delete_own on transaction_rules
for delete to authenticated using ((select auth.uid()) = user_id);

create policy transfer_matches_select_own on transfer_matches
for select to authenticated using ((select auth.uid()) = user_id);
create policy transfer_matches_insert_own on transfer_matches
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy transfer_matches_update_own on transfer_matches
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy transfer_matches_delete_own on transfer_matches
for delete to authenticated using ((select auth.uid()) = user_id);

create policy holdings_select_own on holdings
for select to authenticated using ((select auth.uid()) = user_id);
create policy holdings_insert_own on holdings
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy holdings_update_own on holdings
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy holdings_delete_own on holdings
for delete to authenticated using ((select auth.uid()) = user_id);

create policy investment_activity_select_own on investment_activity
for select to authenticated using ((select auth.uid()) = user_id);
create policy investment_activity_insert_own on investment_activity
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy investment_activity_update_own on investment_activity
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy investment_activity_delete_own on investment_activity
for delete to authenticated using ((select auth.uid()) = user_id);

create policy monthly_snapshots_select_own on monthly_snapshots
for select to authenticated using ((select auth.uid()) = user_id);
create policy monthly_snapshots_insert_own on monthly_snapshots
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy monthly_snapshots_update_own on monthly_snapshots
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy monthly_snapshots_delete_own on monthly_snapshots
for delete to authenticated using ((select auth.uid()) = user_id);

create policy monthly_reports_select_own on monthly_reports
for select to authenticated using ((select auth.uid()) = user_id);
create policy monthly_reports_insert_own on monthly_reports
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy monthly_reports_update_own on monthly_reports
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy monthly_reports_delete_own on monthly_reports
for delete to authenticated using ((select auth.uid()) = user_id);

create policy import_jobs_select_own on import_jobs
for select to authenticated using ((select auth.uid()) = user_id);
create policy import_jobs_insert_own on import_jobs
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy import_jobs_update_own on import_jobs
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy import_jobs_delete_own on import_jobs
for delete to authenticated using ((select auth.uid()) = user_id);

create policy uploaded_documents_select_own on uploaded_documents
for select to authenticated using ((select auth.uid()) = user_id);
create policy uploaded_documents_insert_own on uploaded_documents
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy uploaded_documents_update_own on uploaded_documents
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy uploaded_documents_delete_own on uploaded_documents
for delete to authenticated using ((select auth.uid()) = user_id);

create policy document_extractions_select_own on document_extractions
for select to authenticated using ((select auth.uid()) = user_id);
create policy document_extractions_insert_own on document_extractions
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy document_extractions_update_own on document_extractions
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy document_extractions_delete_own on document_extractions
for delete to authenticated using ((select auth.uid()) = user_id);

create policy extracted_statement_items_select_own on extracted_statement_items
for select to authenticated using ((select auth.uid()) = user_id);
create policy extracted_statement_items_insert_own on extracted_statement_items
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy extracted_statement_items_update_own on extracted_statement_items
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy extracted_statement_items_delete_own on extracted_statement_items
for delete to authenticated using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;
