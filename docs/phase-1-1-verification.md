# Phase 1.1 Verification and Hardening

Date: 2026-06-01

## Scope

Phase 1.1 reviewed and hardened the Phase 1 foundation only. No Phase 2 CSV
workflow, real provider integration, transfer detection, dashboard logic,
AI/OCR extraction, Monthly CFO Report logic, trading, bill pay, money movement,
tax optimization, investment advice, or spreadsheet import features were added.

## Acceptance Criteria Review

| Criteria | Status | Notes |
| --- | --- | --- |
| App builds locally | Complete | `npm run build` passes and Next generated the expected Phase 1 routes. Fresh HTTP route smoke was attempted but not completed in this sandbox. |
| Supabase schema/migrations exist | Complete | Initial migration defines required tables, enums, grants, and RLS; Phase 1.1 migration hardens child-table write policies. |
| RLS is defined for user-owned tables | Complete | All user-owned public tables have RLS enabled and authenticated policies. |
| Demo data can be loaded | Needs manual setup | `supabase/seed.sql` is ready; run `supabase db reset` locally. |
| A user can sign in | Needs manual setup | Auth pages exist; requires Supabase env vars and applied migrations. |
| A user can create institutions | Partially complete | Demo UI works in local storage; Supabase persistence is future wiring. |
| A user can create accounts | Partially complete | Demo UI works in local storage; Supabase persistence is future wiring. |
| Account classification fields exist | Complete | Type, group, status, liquidity, risk, tracking, sync, and quality are present. |
| Active, closed, and archived statuses | Complete | Demo UI edits status without deleting historical rows. |
| Closed/archived history preserved | Complete | No status action deletes balances or transactions. |
| Manual monthly balance entry | Partially complete | Demo UI works in local storage; Supabase persistence is future wiring. |
| Account list with badges | Complete | Status, account type, tracking, sync, and data quality badges are shown. |
| Placeholder module pages | Complete | Required routes load as placeholders. |
| Connector Lab mock provider/report | Complete | Mock adapter and report UI exist. |
| Statement Intake schema/workflow | Partially complete | Schema exists and demo UI stages mock extraction review items. |
| No down-payment features | Complete | Not present. |
| No trading/bill pay/money movement/tax/investment advice | Complete | Not present. |
| No real provider credentials required | Complete | Provider env vars are future placeholders only. |
| No spreadsheet import dependency | Complete | Not present. |
| Codebase ready for Phase 2 | Partially complete | Supabase persistence wiring should come before CSV workflows. |

## Supabase Setup Review

- Client utilities use `@supabase/ssr` browser clients and require
  `NEXT_PUBLIC_SUPABASE_URL` plus `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Server utilities lazily create `@supabase/ssr` server clients with Next
  cookies.
- `src/proxy.ts` refreshes Supabase auth state when Supabase env vars exist.
- The migrations define normalized Phase 1 tables, enums, indexes, RLS,
  authenticated grants, and hardened write policies.
- The seed file uses fake demo data and a fake demo auth user.
- Local setup path: `supabase start`, set `.env.local`, then
  `supabase db reset`.
- Live setup path: set live project env vars, run `supabase db push`, and seed
  only non-production/demo environments intentionally.

## RLS Review

RLS policies were adjusted in the initial migration because the original write
policies verified only `user_id = auth.uid()`. Phase 1.1 adds child-table
ownership checks so users cannot create or update rows that reference another
user's institution, account, provider, category, transaction, document, or
extraction record.

Default categories and provider definitions are currently per-user seed rows,
not globally readable system rows. That is intentional for Phase 1.

## Manual Verification Notes

After local or live Supabase setup:

1. Open `/sign-up` and create a test account.
2. Open `/sign-in` and sign in.
3. Open `/settings/accounts` and create an institution.
4. Create an account and assign all classification fields.
5. Add a manual monthly balance.
6. Confirm the account list badges render.
7. Open `/connector-lab` and confirm the mock capability report renders.
8. Open `/settings/statements`, create a mock statement, and change review
   statuses on staged extracted fields.
9. Open `/mri`, `/investments`, `/cash-flow`, `/transfers`, `/leaks`, and
   `/monthly-report` to confirm placeholder pages load.

## Audit Status

The last successful `npm audit --omit=dev` run reported 2 moderate advisories
through Next's nested `postcss` dependency. The suggested forced fix would
downgrade Next, so it is documented and left unchanged pending a compatible
Next update.

A fresh audit rerun with a 2026-06-02 npm log timestamp reached the npm
registry audit endpoint but failed with an `EACCES` fetch error in this
sandbox. The network-permitted rerun was blocked by the approval system, so the
advisory status remains documented from the last successful audit rather than
force-changing dependencies.

## Remaining Risks and Manual Setup

- Supabase migrations and seed data still need to be applied in a real local or
  live Supabase project.
- Demo UI state is local-storage backed until Supabase persistence is wired.
- RLS has been reviewed in SQL but not exercised against a live Supabase
  database in this environment.
- A fresh HTTP route smoke check was attempted after the build, but the
  temporary server command was blocked by the approval system and the existing
  port 3000 server stopped responding mid-check. Use `npm run start` after
  `npm run build` for manual route verification.
