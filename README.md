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

## Supabase Setup

1. Install and authenticate the Supabase CLI.
2. Create or link a local Supabase project.
3. Copy `.env.example` to `.env.local`.
4. Set `NEXT_PUBLIC_SUPABASE_URL`.
5. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
6. Run migrations and seed data:

```bash
supabase db reset
```

The seed creates a fake local demo user:

- Email: `demo@myfinassist.local`
- Password: `demo-password`

Seed data is fictional and must not be replaced with real financial credentials
or real account numbers.

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

## Next Recommended Phases

1. Manual transaction entry and generic CSV import mapping.
2. Analytical dashboards for MRI, Cash Flow, and Investments.
3. Transfer detection and review.
4. Lifestyle Leak Detector and Monthly CFO Report.
5. Real provider integrations behind the adapter interfaces.

## Project Memory

This project is built in stages. Before continuing work from any machine or
session, review:

- [Project context](docs/project-context.md)
- [Product requirements](docs/product-requirements.md)
- [Phase 1 implementation plan](docs/phase-1-implementation-plan.md)
- [Progress log](docs/progress-log.md)
- [Decision record](docs/decisions.md)

Standing agreement: each material project change should update the relevant
Markdown context, then be committed and pushed to GitHub.
