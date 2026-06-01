# Product Requirements

## Product Goal

MyFinAssist is a private, read-only personal finance intelligence web app. It
helps the user understand what is happening with their money each month by
tracking accounts, balances, investments, transactions, transfers, spending
patterns, and monthly financial trends.

The app should feel like a personal monthly financial close system, not a
generic budgeting app.

The app must answer:

- Where is my money?
- How are my investments performing?
- How much did I actually spend?
- Which transactions were only money moving between my own accounts?
- What spending patterns are creeping up?
- What changed this month that deserves attention?
- Which accounts can sync automatically, partially sync, or require CSV,
  statement, or manual tracking?

## Core Constraints

- Start fresh. Do not import, rely on, reference, or recreate any existing Excel
  workbook or Google Sheet.
- Keep the system platform-agnostic and account-lifecycle-friendly.
- Do not hard-code the app around any specific bank, credit card, brokerage,
  crypto platform, retirement account, HSA, loan provider, or data source.
- Keep the app read-only and analytical.
- Do not move money, place trades, make investment recommendations, or provide
  tax advice.
- Do not store bank usernames, passwords, or real provider credentials.
- Use demo data only until real integrations are intentionally added later.

## Preferred Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Auth
- Recharts
- Zod
- TanStack Table or equivalent

## Non-Negotiable Exclusions

Do not build:

- Down-payment planner or Down Payment Mode
- Sell Order Planner
- Trading
- Buy or sell investment recommendations
- Bill pay
- ACH or money movement
- Tax optimization
- Tax-loss harvesting
- Retirement projection engine
- Full AI financial advisor
- Multi-user collaboration
- Public sharing
- Spreadsheet import dependency
- Real bank or investment syncing as the first task
- Any feature that stores bank usernames or passwords

## Data Source Strategy

The app should support multiple data paths in this preferred order:

1. Automatic sync where available
2. CSV import where sync is incomplete or unavailable
3. Monthly statement upload where CSV or sync does not work
4. Manual entry as the final fallback

Phase 1 should include architecture and mock/demo flows only. Real Plaid,
SimpleFIN, Teller, SnapTrade, OpenAI, OCR, or other provider integrations are
future work.

Every account should have a tracking method and data quality status. Dashboards
must respect those fields and must not assume all accounts can sync.

## Primary Modules

Navigation should stay simple:

- MRI
- Investments
- Cash Flow
- Transfers
- Leaks
- Monthly Report
- Connector Lab
- Settings

Statement Intake can live under Settings or Imports initially.

## Module Requirements

### Financial MRI

Purpose: show a clean snapshot of the user's financial life.

Show:

- Net worth
- Total assets
- Total liabilities
- Cash
- Taxable investments
- Retirement accounts
- HSA accounts
- Crypto
- Debt
- Credit-card balances
- Month-over-month change
- Liquid vs restricted money
- Active vs closed or archived accounts

Use account usefulness classes:

- Operating Cash
- Emergency Cash
- Invested but Accessible
- Volatile Assets
- Retirement / Restricted
- Tax-Advantaged Health
- Debt
- Other

Net worth rules:

- Asset accounts increase net worth.
- Liability accounts decrease net worth.
- Credit-card balances are liabilities.
- Mortgages, student loans, and other loans are liabilities.
- Closed and archived accounts preserve history but are hidden or de-emphasized
  in current views by default.
- Accounts can be excluded from net worth.

### Investment Performance Center

Purpose: separate investment growth from money added by the user.

Track:

- Beginning monthly balance
- Ending monthly balance
- Contributions
- Withdrawals
- Estimated investment growth
- Estimated monthly return
- Estimated quarterly return
- Estimated YTD return
- Current value
- Prior-month value
- Account status
- Data quality status

MVP formulas:

- Estimated Investment Growth = Ending Balance - Beginning Balance - Net
  Contributions
- Net Contributions = Contributions - Withdrawals
- Estimated Monthly Return = Estimated Investment Growth / Beginning Balance

Guardrails:

- Do not calculate returns when beginning balance is zero or missing.
- Label returns as estimated when based only on monthly balances and cash-flow
  data.
- Do not implement Modified Dietz, time-weighted returns, cost basis,
  holdings-level analytics, or tax-lot tracking in the first version.

### Cash Flow Engine

Purpose: separate actual spending from transfers, debt payments, investment
contributions, refunds, and reimbursements.

Transaction type answers: what kind of money movement is this?

Supported transaction types:

- income
- true_expense
- transfer
- internal_payment
- investment_contribution
- investment_withdrawal
- debt_payment
- refund
- reimbursement
- fee
- interest
- dividend
- uncategorized

Transaction category answers: what was this for?

Default categories:

- Dining
- Groceries
- Merchandise
- Travel
- Lodging
- Entertainment
- Gas / Automotive
- Mortgage
- Student Loans
- Utilities
- Subscriptions
- Insurance
- Medical
- Rent
- Income
- Investment Contribution
- Credit Card Payment
- Transfer
- Reimbursement
- Refund
- Fees
- Interest
- Dividends
- Other

Double-counting rule: credit-card purchases count as expenses. Later payments
to the credit-card company are internal payments or transfers and must not be
counted again as true spending.

Free Cash Flow = Income - True Expenses - Debt Payments

Investment contributions are shown separately from true expenses. Transfers and
internal payments do not reduce free cash flow.

### Transfer Cleaner

Purpose: detect money moving between the user's own accounts so it is not
misclassified as spending or income.

Detect likely transfers using:

- Matching amounts
- Opposite transaction directions
- Dates within a configurable window
- Known account names
- Known institution or platform names
- Transaction descriptions
- Recurring payment patterns

Each possible match should include a confidence score from 0 to 100, source
transaction, candidate matching transaction, suggested transaction type,
suggested category, match reason, approve action, reject action, and review
status.

Confirmed transfers should be excluded from true spending and income unless
classified as reimbursement or income. Account migrations should be classified
as internal transfers, not income, spending, or investment growth.

### Lifestyle Leak Detector

Purpose: identify spending patterns that are quietly increasing.

Compare current month against:

- Prior month
- 3-month average
- 6-month average

Flag:

- Categories above normal
- Merchants above normal
- Unusually large transactions
- Subscriptions that increased
- Small transactions that add up
- Weekend spending increases
- Unusual Venmo or Zelle outflows
- Uncategorized transaction totals
- Repeated discretionary purchases

Use factual, helpful, non-judgmental language.

Default thresholds:

- Category increase: greater than 25% and greater than $100 above comparison
  average
- Merchant increase: greater than 30% and greater than $50 above comparison
  average
- Large transaction: greater than 2x category average or greater than $250
- Small-purchase pileup: transactions under $25 totaling more than $200 in a
  month
- Uncategorized warning: uncategorized total greater than $100 or more than 5
  transactions

### Monthly CFO Report

Purpose: create a rule-based plain-English monthly summary.

MVP reports should not use AI. Generate them from structured calculations and
rules.

Report sections:

1. Executive Summary
2. Net Worth Summary
3. Investment Summary
4. Cash Flow Summary
5. Lifestyle Leaks
6. Transfer Cleanup
7. Transactions Needing Review
8. Action Items

Summarize net worth change, cash change, investment contributions, estimated
investment growth, income, true expenses, debt payments, transfers, free cash
flow, category increases, merchant increases, unusual transactions, transfer
matches needing review, uncategorized transactions, and suggested action items.

### Connector Lab

Purpose: test automatic syncing feasibility without making the app dependent on
sync.

Connector Lab should answer which accounts can automatically sync, partially
sync, provide balance-only data, provide transactions, provide holdings, or
require manual, CSV, or statement tracking.

Phase 1 requirements:

- Build the UI structure.
- Build provider adapter interfaces.
- Include mock/demo provider adapters.
- Add environment variable placeholders for future providers.
- Do not require real provider credentials to run locally.
- Do not store real financial credentials.
- Do not block the app if no real provider is configured.

Recommended tracking methods:

- full_sync
- balance_only
- transaction_only
- holdings_only
- csv_import
- manual_balance
- manual_full
- statement_upload
- unsupported

Data quality statuses:

- excellent
- good
- partial
- poor
- manual
- unsupported
- unknown

### Statement Intake

Purpose: allow monthly statement uploads as a fallback or validation source
when automatic syncing is unavailable, incomplete, or unreliable.

Workflow:

1. Upload a statement
2. Select or create the related account
3. Select document type
4. Enter or infer statement period
5. Store document metadata
6. Extract candidate data into staging/review
7. Show extracted values for review
8. Allow approve, edit, reject, or ignore
9. Write only approved values to final financial tables

AI/OCR extraction is a helper, not the source of truth. Do not automatically
save extracted values into balances, transactions, holdings, or reports without
user approval.

Phase 1 should include schema, UI structure, upload/review workflow shape, and
a mock extractor. Real AI, OCR, OpenAI extraction, deterministic PDF parsing,
and institution-specific parsers are future work.

### Account Management / Settings

The app must support:

- Creating institutions
- Creating accounts
- Editing accounts
- Marking accounts active, closed, or archived
- Assigning account type
- Assigning account group
- Assigning liquidity class
- Assigning risk class
- Assigning tracking method
- Assigning sync status
- Including or excluding accounts from net worth
- Including or excluding accounts from cash flow
- Preserving historical data for closed or archived accounts

Separate these concepts:

- Institution: financial company or platform
- Account: the user's specific financial account
- Provider: data source used to receive data

One institution may be accessed through multiple providers. One account may
change providers over time.

## Required Database Coverage

Use normalized Supabase Postgres tables with migrations.

Create tables for at least:

- profiles
- institutions
- accounts
- data_providers
- account_connections
- account_balances
- transactions
- categories
- transaction_rules
- transfer_matches
- holdings
- investment_activity
- monthly_snapshots
- monthly_reports
- import_jobs
- uploaded_documents
- document_extractions
- extracted_statement_items

All user-owned tables must include `user_id` and be protected by row-level
security.

## Required Enumerations

Account types:

- checking
- savings
- credit_card
- taxable_brokerage
- robo_investor
- crypto
- 401k
- 457b
- ira
- hsa
- pension
- mortgage
- student_loan
- personal_loan
- property
- other_asset
- other_liability

Account groups:

- cash
- taxable_investments
- retirement
- hsa
- crypto
- property
- debt
- credit_cards
- other

Account statuses:

- active
- closed
- archived

Liquidity classes:

- operating_cash
- emergency_cash
- invested_accessible
- volatile_asset
- retirement_restricted
- tax_advantaged_health
- debt
- other

Tracking methods:

- manual_balance
- manual_full
- csv_import
- full_sync
- balance_sync
- transaction_sync
- holdings_sync
- statement_upload
- unsupported

Sync statuses:

- manual
- syncing
- sync_error
- balance_only
- transaction_only
- holdings_only
- full_sync
- unsupported

Transaction types:

- income
- true_expense
- transfer
- internal_payment
- investment_contribution
- investment_withdrawal
- debt_payment
- refund
- reimbursement
- fee
- interest
- dividend
- uncategorized

Transfer match statuses:

- pending
- approved
- rejected

Data quality statuses:

- excellent
- good
- partial
- poor
- manual
- unsupported
- unknown

## Security Requirements

- Implement Supabase Auth.
- Implement row-level security.
- Keep user-specific data isolated.
- Handle sensitive operations server-side.
- Use environment variables for future provider credentials.
- Do not put API secrets in client-side code.
- Do not put real financial credentials in code or seed data.
- Use demo data only.
- Include clear README setup instructions.

## CSV and Manual Data Requirements

The app must work without automatic syncing.

Support:

- Manual institution creation
- Manual account creation
- Manual monthly balance entry
- Manual transaction entry
- Generic CSV transaction import structure
- Demo seed data

CSV mapping should allow:

- date
- posted date
- description
- merchant
- amount
- debit
- credit
- category
- account
- notes

Do not make CSV import specific to one bank or credit-card company.

## UI and UX Requirements

Design principles:

- Simple
- Clean
- Private
- Insight-first
- Not cluttered
- Easy to review
- Easy to correct data
- Clear empty states
- Clear error states

Use:

- Cards for major metrics
- Charts for trends
- Tables for review workflows
- Badges for account status, sync status, tracking method, and data quality
- Review queues for transfers, uncategorized transactions, and statement
  extractions

Required routes:

- `/mri`
- `/investments`
- `/cash-flow`
- `/transfers`
- `/leaks`
- `/monthly-report`
- `/connector-lab`
- `/settings/accounts`
- `/settings/categories`
- `/settings/rules`
- `/settings/imports`
- `/settings/statements`

## Phase 1 Scope

Phase 1 should include:

- Project setup
- Supabase setup structure
- Authentication structure
- Database schema and migrations
- Row-level security policies
- Seed/demo data
- Main app layout and navigation
- Account management
- Institution management
- Manual monthly balance entry
- Category seed data
- Basic transaction model
- Uploaded document/statement schema
- Connector Lab schema and mock provider interface
- Placeholder pages for all major modules
- README setup instructions

Phase 1 should not implement real provider integrations, production AI/OCR, CSV
import processing, transfer detection, full dashboards, or the Monthly CFO
report engine.

## Phase 1 Acceptance Criteria

Phase 1 is complete when:

- The app runs locally.
- Supabase schema and migrations exist.
- Row-level security is defined for user-owned tables.
- Demo data can be loaded.
- A user can sign in.
- A user can create institutions.
- A user can create accounts.
- A user can classify accounts by account type, group, liquidity class, risk
  class, status, tracking method, and sync status.
- A user can mark accounts active, closed, or archived.
- Closed and archived accounts preserve history.
- A user can enter monthly account balances.
- A user can view a basic account list with badges for status, tracking method,
  and data quality.
- A user can view placeholder pages for MRI, Investments, Cash Flow, Transfers,
  Leaks, Monthly Report, Connector Lab, and Settings.
- Connector Lab has a mock provider interface and mock capability report.
- Statement Intake has schema and a basic upload/review placeholder workflow.
- No down-payment features exist.
- No trading, bill pay, money movement, tax optimization, or investment
  recommendation features exist.
- No real banking credentials or provider secrets are required.
- The app does not rely on any spreadsheet import.
