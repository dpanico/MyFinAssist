# Phase 1 Implementation Plan

## Goal

Build the foundation for MyFinAssist: a private, read-only personal finance
intelligence web app with Supabase-backed authentication, normalized financial
data models, secure user isolation, manual account and balance workflows, mock
connector architecture, statement intake scaffolding, and placeholder pages for
the future analytical modules.

## 1. Proposed App Structure

Use a Next.js App Router project with TypeScript and a small set of focused
feature folders.

Proposed structure:

```text
app/
  (auth)/
    sign-in/
    sign-up/
  (app)/
    layout.tsx
    mri/
    investments/
    cash-flow/
    transfers/
    leaks/
    monthly-report/
    connector-lab/
    settings/
      accounts/
      categories/
      rules/
      imports/
      statements/
  api/
    mock-connectors/
components/
  app-shell/
  badges/
  forms/
  tables/
  charts/
  empty-states/
features/
  accounts/
  institutions/
  balances/
  transactions/
  connector-lab/
  statements/
  categories/
lib/
  supabase/
  validation/
  finance/
  demo-data/
supabase/
  migrations/
  seed.sql
```

Implementation approach:

- Keep pages thin. Put domain-specific forms, tables, queries, and validation
  inside `features/*`.
- Use Supabase server clients for authenticated server-side reads and writes.
- Use Zod schemas at form and server-action boundaries.
- Use Tailwind for layout and Recharts only where Phase 1 placeholder visuals
  benefit from simple charts.
- Use TanStack Table for account, institution, balance, and review tables.

## 2. Proposed Database Schema

Use Supabase Postgres migrations. Prefer Postgres enum types for constrained
financial concepts and foreign keys for normalized relationships.

Core shared columns for user-owned tables:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Tables:

- `profiles`: user display profile linked one-to-one with `auth.users`.
- `institutions`: financial company/platform records owned by a user.
- `data_providers`: provider catalog such as manual, CSV, mock connector, and
  future Plaid/SimpleFIN/Teller/SnapTrade placeholders.
- `accounts`: user's specific accounts with institution, account type, group,
  liquidity class, risk class, status, tracking method, sync status, data
  quality, and include/exclude flags.
- `account_connections`: relationship between accounts and providers, including
  provider status, last sync metadata, and capability summary.
- `account_balances`: monthly or dated balance records for accounts.
- `categories`: default and user-owned transaction categories.
- `transactions`: transaction ledger with separate `transaction_type` and
  `category_id`.
- `transaction_rules`: future categorization and classification rules.
- `transfer_matches`: candidate and approved internal transfer matches.
- `holdings`: future investment holding snapshots.
- `investment_activity`: contributions, withdrawals, dividends, interest, and
  other investment cash-flow activity.
- `monthly_snapshots`: calculated monthly summary values for later dashboards.
- `monthly_reports`: generated rule-based report records for later phases.
- `import_jobs`: CSV/manual/statement import job tracking.
- `uploaded_documents`: uploaded statement metadata.
- `document_extractions`: extraction run metadata using mock extractor in
  Phase 1.
- `extracted_statement_items`: staged statement facts that require review
  before writing to final financial tables.

Required enum groups:

- Account types: checking, savings, credit_card, taxable_brokerage,
  robo_investor, crypto, 401k, 457b, ira, hsa, pension, mortgage, student_loan,
  personal_loan, property, other_asset, other_liability.
- Account groups: cash, taxable_investments, retirement, hsa, crypto, property,
  debt, credit_cards, other.
- Account statuses: active, closed, archived.
- Liquidity classes: operating_cash, emergency_cash, invested_accessible,
  volatile_asset, retirement_restricted, tax_advantaged_health, debt, other.
- Tracking methods: manual_balance, manual_full, csv_import, full_sync,
  balance_sync, transaction_sync, holdings_sync, statement_upload, unsupported.
- Sync statuses: manual, syncing, sync_error, balance_only, transaction_only,
  holdings_only, full_sync, unsupported.
- Transaction types: income, true_expense, transfer, internal_payment,
  investment_contribution, investment_withdrawal, debt_payment, refund,
  reimbursement, fee, interest, dividend, uncategorized.
- Transfer match statuses: pending, approved, rejected.
- Data quality statuses: excellent, good, partial, poor, manual, unsupported,
  unknown.

Security:

- Enable row-level security on all user-owned tables.
- Policies should allow users to select, insert, update, and delete only rows
  where `user_id = auth.uid()`.
- Demo seed data must not include real financial credentials or secrets.

## 3. Proposed Page and Routes Structure

Authentication:

- `/sign-in`: sign in with Supabase Auth.
- `/sign-up`: create account using Supabase Auth.

Primary app routes:

- `/mri`: Phase 1 placeholder showing top-level metric cards fed by demo or
  basic balance data.
- `/investments`: placeholder for estimated investment performance.
- `/cash-flow`: placeholder for income, true expenses, debt payments, and free
  cash flow.
- `/transfers`: placeholder review queue for future transfer matches.
- `/leaks`: placeholder for spending pattern alerts.
- `/monthly-report`: placeholder for rule-based monthly CFO report.
- `/connector-lab`: mock provider capability table and mock capability report.
- `/settings/accounts`: institution/account management and balance entry.
- `/settings/categories`: category list seeded with defaults.
- `/settings/rules`: placeholder for transaction rules.
- `/settings/imports`: placeholder for generic CSV/manual import jobs.
- `/settings/statements`: uploaded document and extraction review placeholder.

Navigation:

- Use a persistent app shell with left navigation on desktop and a compact
  mobile navigation pattern.
- Keep Settings grouped, with Statement Intake under Settings in Phase 1.

## 4. Core Financial Logic

Phase 1 should define reusable functions even where the UI remains basic.

Net worth:

- Asset accounts add to net worth.
- Liability accounts subtract from net worth.
- Exclude accounts where `include_in_net_worth = false`.
- Closed and archived accounts preserve history but are hidden or
  de-emphasized in current account views by default.

Cash flow:

- Free Cash Flow = Income - True Expenses - Debt Payments.
- Transfers and internal payments do not reduce free cash flow.
- Investment contributions are tracked separately from true expenses.
- Credit-card purchases count as expenses; later card payments are internal
  payments and must not be counted again.

Investment performance:

- Net Contributions = Contributions - Withdrawals.
- Estimated Investment Growth = Ending Balance - Beginning Balance - Net
  Contributions.
- Estimated Monthly Return = Estimated Investment Growth / Beginning Balance.
- Do not calculate return if beginning balance is zero or missing.
- Label returns as estimated when based only on monthly balances and
  contribution/withdrawal data.

Connector capability:

- Represent providers through a common adapter interface.
- Phase 1 adapters return mock capability reports only.
- Recommended tracking method and data quality should be explicit fields, not
  inferred from provider name.

Statement intake:

- Uploaded documents create metadata records.
- Mock extraction writes staged extracted items.
- Staged items require approve/edit/reject/ignore review state.
- Only approved values can later be written into final balances, transactions,
  holdings, or reports.

## 5. Development Phases

### Phase 1: Foundation

Build:

- Next.js, TypeScript, Tailwind project setup.
- Supabase client/server setup and environment placeholders.
- Supabase migrations with required tables, enums, indexes, and RLS policies.
- Demo seed data and default categories.
- Supabase Auth sign-in/sign-up structure.
- App shell and navigation.
- Institution management.
- Account management with required classifications.
- Manual monthly balance entry.
- Basic account list with status, tracking method, sync status, and data
  quality badges.
- Basic transaction model and category seed data.
- Connector Lab mock provider interface and mock capability report.
- Statement Intake schema and basic upload/review placeholder workflow.
- Placeholder pages for all major modules.
- README setup instructions.

Do not build real provider integrations, AI/OCR extraction, trading, money
movement, tax advice, spreadsheet dependency, or recommendation features.

### Phase 2: Manual Data and CSV Workflows

Build generic CSV import mapping, manual transaction entry, import job review,
transaction tables, basic category assignment, and transaction rule previews.

### Phase 3: Analytical Dashboards

Build Financial MRI, Cash Flow, Investment Performance, and trend dashboards
using approved balances, transactions, and investment activity.

### Phase 4: Transfer Cleaner

Build transfer candidate detection, confidence scoring, review actions, and
approved transfer handling.

### Phase 5: Lifestyle Leaks and Monthly CFO Report

Build rule-based spending alerts and monthly report generation from structured
calculations.

### Phase 6: Real Integrations

Add real providers one at a time behind the adapter interfaces. Keep manual,
CSV, and statement workflows first-class.

## 6. True Blocking Questions

No blocking questions for Phase 1.

Conservative assumptions for Phase 1:

- Use the latest stable Next.js App Router setup available at implementation
  time.
- Use Supabase local development for migrations and seed data.
- Store uploaded statement files through a placeholder flow initially; the
  schema will support storage metadata, while production storage wiring can be
  finalized during implementation.
- Use demo-only financial data with clearly fake institutions, accounts,
  balances, and transactions.
- Keep all financial actions read-only and analytical.
- Keep Statement Intake under Settings for Phase 1 to avoid expanding primary
  navigation too early.

## Phase 1 Acceptance Checklist

- The app runs locally.
- Supabase schema and migrations exist.
- RLS is defined for user-owned tables.
- Demo data can be loaded.
- A user can sign in.
- A user can create institutions.
- A user can create accounts.
- A user can classify accounts by type, group, liquidity class, risk class,
  status, tracking method, and sync status.
- A user can mark accounts active, closed, or archived.
- Closed and archived accounts preserve history.
- A user can enter monthly account balances.
- A user can view a basic account list with badges.
- Placeholder pages exist for all major modules.
- Connector Lab has a mock provider interface and mock capability report.
- Statement Intake has schema and basic upload/review placeholder workflow.
- No excluded features exist.
- No real banking credentials or provider secrets are required.
- The app does not rely on spreadsheet import.
