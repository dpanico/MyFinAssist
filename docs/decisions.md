# Decision Record

## DEC-001: Track Project Memory in Markdown

Status: Accepted

Date: 2026-06-01

Decision: Maintain project progress, decisions, and useful conversation context
in Markdown files inside the repository.

Rationale: The project will be built in stages, and the user wants enough
durable context in GitHub to resume from any machine or session.

Implications:

- Future changes should update the relevant Markdown memory files.
- The docs should capture durable context and decisions, not every line of chat.

## DEC-002: Commit and Push After Material Changes

Status: Accepted

Date: 2026-06-01

Decision: After each material project change, commit the work and push it to the
GitHub remote.

Rationale: Keeping GitHub current ensures the project can be picked up from
another environment without relying on local-only state.

Implications:

- Commits should be focused and named clearly.
- If a change affects project direction or implementation assumptions, update
  the Markdown memory files before committing.

## DEC-003: Build a Fresh Read-Only Finance Intelligence App

Status: Accepted

Date: 2026-06-01

Decision: Build MyFinAssist as a fresh private web app. Do not import, depend
on, reference, or recreate an existing Excel workbook or Google Sheet.

Rationale: The app should become a durable personal finance intelligence system
with normalized data models, not a spreadsheet wrapper.

Implications:

- Spreadsheet import can exist later only as a generic CSV/manual data path,
  not as a dependency on a specific workbook.
- The app should stay platform-agnostic across financial institutions,
  providers, and account lifecycle changes.

## DEC-004: Keep the App Read-Only and Analytical

Status: Accepted

Date: 2026-06-01

Decision: MyFinAssist will explain financial data but will not move money,
place trades, recommend buys or sells, optimize taxes, or store banking
credentials.

Rationale: The product goal is insight and monthly financial review, not
financial execution or regulated advice.

Implications:

- No trading, bill pay, ACH, tax optimization, or investment recommendation
  features should be added.
- Provider credentials and financial secrets must not be stored in code, seed
  data, or client-side bundles.

## DEC-005: Use a Supabase-Backed Next.js Foundation

Status: Accepted

Date: 2026-06-01

Decision: Use Next.js, React, TypeScript, Tailwind CSS, Supabase Postgres,
Supabase Auth, Recharts, Zod, and TanStack Table or equivalent unless a strong
technical reason emerges later.

Rationale: This stack supports authenticated full-stack development, typed UI,
secure Postgres storage, charting, validation, and review tables with a small
operational footprint.

Implications:

- Phase 1 should include Supabase migrations, row-level security, auth
  structure, demo seed data, and setup docs.
- Future provider integrations should be added behind adapter interfaces rather
  than embedded directly in pages.

## DEC-006: Treat Sync as Optional, Not Foundational

Status: Accepted

Date: 2026-06-01

Decision: Design around multiple data paths: automatic sync, CSV import,
statement upload, and manual entry. Phase 1 will include mock/demo connector
interfaces only.

Rationale: Not all accounts can sync completely or reliably, and the app must
remain useful when accounts are manual, balance-only, or statement-based.

Implications:

- Every account needs tracking method, sync status, and data quality fields.
- Dashboards and workflows must respect tracking method and data quality.
- Real Plaid, SimpleFIN, Teller, SnapTrade, OpenAI, OCR, and other integrations
  are future phases.

## DEC-007: Use Demo-Mode UI Until Supabase Is Configured

Status: Accepted

Date: 2026-06-01

Decision: Phase 1 UI workflows use fake demo data and local browser storage so
the app can run without real financial data or provider credentials. Supabase
migrations, RLS, Auth utilities, and seed data are included so persistence can
be connected when a Supabase project is configured.

Rationale: The first phase must be useful as a foundation and locally runnable
without requiring real providers or sensitive data.

Implications:

- Demo UI data is not a substitute for production persistence.
- Later phases should wire account, institution, balance, transaction, and
  statement workflows to Supabase queries and mutations.
- The app must continue to avoid real credentials and real account data in seed
  data and source code.
