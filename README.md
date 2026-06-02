# MyFinAssist
Private, read-only personal finance intelligence for a monthly financial close.

MyFinAssist helps track accounts, balances, transactions, statement fallback
workflows, connector feasibility, and future monthly financial trends without
moving money, trading, giving tax advice, or depending on spreadsheets.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Postgres
- Supabase Auth
- Zod
- Recharts
- TanStack Table compatible table structure

## Local Setup

This repo includes a portable `.tools` Node/npm setup only for this Codex
workspace. It is ignored by Git. On another machine, install Node.js 22 or newer
and run the normal `npm` commands.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

If you are using the portable workspace Node used during this build, prepend the
local runtime to PATH first:

```powershell
$env:PATH = (Resolve-Path .tools\node-v22.22.3-win-x64).Path + ';' + $env:PATH
.tools\node-v22.22.3-win-x64\npm.cmd run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL. Local default is
  `http://127.0.0.1:54321`.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: browser-safe Supabase publishable or
  anon key.

Never put a Supabase `service_role` key or provider secret in a
`NEXT_PUBLIC_` variable.

Provider placeholders such as Plaid, SimpleFIN, Teller, SnapTrade, and OpenAI
are included for future planning only. Phase 1 does not use them and must run
without them.

## Supabase Setup

### Local Supabase

1. Install the Supabase CLI.
2. Start the local stack:

```bash
supabase start
```

3. Copy `.env.example` to `.env.local`.
4. Use the local API URL and anon/publishable key printed by `supabase start`.
5. Apply migrations and seed demo data:

```bash
supabase db reset
```

`supabase db reset` applies migrations first and then runs `supabase/seed.sql`.

The seed creates a fake local demo user:

- Email: `demo@myfinassist.local`
- Password: `demo-password`

Seed data is fictional and must not be replaced with real financial credentials
or real account numbers.

### Live Supabase Project

1. Create a Supabase project.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to the live project URL.
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the live publishable/anon key.
4. Apply migrations:

```bash
supabase db push
```

5. Seed demo data only in non-production environments. For live development,
   run seed SQL intentionally and verify it does not contain real financial
   data.

### Auth and RLS Verification

After migrations are applied:

1. Open `/sign-up` and create a test account.
2. Open `/sign-in` and sign in.
3. Confirm authenticated table access uses the signed-in user's JWT.
4. In SQL, verify another user's rows are not visible through authenticated
   client requests.
5. Confirm child-table writes cannot reference another user's account,
   category, provider, transaction, document, or extraction record.

The migrations enable RLS on all user-owned public tables. Policies require
authenticated users and enforce `auth.uid() = user_id`; the Phase 1.1 hardening
migration also validates ownership of referenced parent rows on child-table
insert and update operations.

## Phase 1 Includes

- Next.js project foundation
- Supabase auth structure
- Supabase migrations with normalized tables
- Row-level security policies for user-owned rows
- Demo seed data
- Main app shell and navigation
- Institution management
- Account management
- Manual monthly balance entry
- Category seed data
- Basic transaction data model and validation schema
- Mock Connector Lab provider interface and report
- Statement Intake placeholder upload/review workflow
- Placeholder pages for future analytical modules

Phase 1 UI workflows use demo-mode browser storage so the app can run before a
Supabase project is configured. Supabase migrations, RLS, Auth utilities, and
seed data are ready for local/live setup, but UI persistence is not yet wired to
Supabase mutations.

## Phase 1 Intentionally Excludes

- Real Plaid, SimpleFIN, Teller, SnapTrade, OpenAI, or OCR integrations
- Real AI extraction
- CSV processing engine
- Transfer detection engine
- Full Financial MRI dashboard calculations
- Full investment performance dashboard
- Full cash-flow dashboard
- Lifestyle Leak Detector engine
- Monthly CFO Report engine
- Down-payment tools
- Sell-order tools
- Trading
- Bill pay
- Money movement
- Tax planning
- Investment recommendations
- Spreadsheet import dependency

## Checks

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Manual Verification

Use these routes after `npm run dev` or `npm run build && npm run start`:

- `/sign-up`: verify Supabase sign-up structure.
- `/sign-in`: verify Supabase sign-in structure.
- `/settings/accounts`: create/edit institutions, create/edit accounts, assign
  classifications, mark active/closed/archived, and add monthly balances.
- `/settings/accounts`: confirm account badges show status, account type,
  tracking method, sync status, and data quality.
- `/connector-lab`: confirm mock provider capability report loads.
- `/settings/statements`: create a mock statement record and review staged
  extracted items.
- `/mri`, `/investments`, `/cash-flow`, `/transfers`, `/leaks`, and
  `/monthly-report`: confirm placeholders load and do not claim final
  analytics.

## Known Limitations

- Supabase migrations and seed files are present, but they must be applied to a
  local or live Supabase project manually.
- Phase 1 demo UI state is stored in browser local storage until Supabase
  persistence is wired in a later step.
- Statement Intake uses mock staged extraction records only.
- Connector Lab uses a mock provider only.
- No CSV engine, transfer detection, dashboards, real provider integrations,
  AI/OCR extraction, or Monthly CFO Report logic exist yet.

## Audit Status

The last successful `npm audit --omit=dev` run reported 2 moderate advisories
through Next's nested `postcss` dependency. The suggested
`npm audit fix --force` path would downgrade Next, so it has not been applied.
Track the advisory and update Next normally when a patched compatible release
is available.

## Next Recommended Phases

Next recommended step: wire Phase 1 account, institution, balance, and statement
workflows to Supabase queries/mutations before starting Phase 2 CSV workflows.

## Project Memory

This project is built in stages. Before continuing work from any machine or
session, review:

- [Project context](docs/project-context.md)
- [Product requirements](docs/product-requirements.md)
- [Phase 1 implementation plan](docs/phase-1-implementation-plan.md)
- [Phase 1.1 verification](docs/phase-1-1-verification.md)
- [Progress log](docs/progress-log.md)
- [Decision record](docs/decisions.md)

Standing agreement: each material project change should update the relevant
Markdown context, then be committed and pushed to GitHub.
