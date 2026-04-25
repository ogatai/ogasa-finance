# ogasa-finance AI Project Overview

## 1. Project Purpose

- `ogasa-finance` is a personal finance platform built on Next.js App Router.
- Primary goal: ingest CSV transaction data from multiple financial institutions, normalize it into a common schema, and analyze/display it.
- Current implementation focuses on:
  - CSV import pipeline
  - Transaction storage and retrieval
  - Basic dashboard navigation and transaction list UI

## 2. Tech Stack (Current)

- Frontend/Backend framework: Next.js `16.2.4` (App Router)
- Runtime UI: React `19.2.4`
- Language: TypeScript
- Styling: Tailwind CSS v4 + shadcn/ui utilities
- ORM: Drizzle ORM
- DB driver: Neon serverless (`drizzle-orm/neon-http`)
- Schema/migrations tooling: `drizzle-kit`
- CSV parsing (client-side): `@duckdb/duckdb-wasm`
- Validation/helper libs: custom type definitions in `types/csv.ts`

## 3. Repository Map (Important Paths)

- `app/`
  - `layout.tsx`: root HTML/layout wrapper
  - `page.tsx`: top page (entry guidance)
  - `(dashboard)/layout.tsx`: dashboard layout with sidebar
  - `(dashboard)/transactions/page.tsx`: server component that reads transactions from DB
  - `api/import/route.ts`: POST endpoint to persist normalized CSV rows
  - `api/transactions/route.ts`: GET endpoint for filtered transaction retrieval
- `lib/`
  - `db/schema.ts`: Drizzle schema (users, accounts, categories, transactions)
  - `db/index.ts`: DB client initialization
  - `csv/parser.ts`: DuckDB-WASM CSV parsing
  - `csv/normalizer.ts`: raw CSV row to common transaction conversion
  - `csv/mappings/*.ts`: institution-specific column mapping logic
- `types/csv.ts`: CSV-related core types (`RawRow`, `CommonTransaction`, `ColumnMapping`)
- `drizzle.config.ts`: Drizzle kit config and `.env` loading behavior
- `docker-compose.yml`: local PostgreSQL container for dev

## 4. Runtime Architecture (High Level)

1. User uploads CSV in UI (dropzone component in dashboard import area).
2. Client parses CSV using DuckDB-WASM (`lib/csv/parser.ts`).
3. Parsed rows are normalized into `CommonTransaction[]` via mapping rules (`lib/csv/normalizer.ts` + `lib/csv/mappings/*`).
4. UI sends normalized payload to `POST /api/import`.
5. API route inserts rows into `transactions` table via Drizzle.
6. Transactions are displayed via:
   - Server component page: `app/(dashboard)/transactions/page.tsx`
   - API route: `GET /api/transactions` (query filters)

## 5. Data Model Summary (Drizzle)

Defined in `lib/db/schema.ts`.

- Enums:
  - `transaction_type`: `income | expense | asset`
  - `account_type`: `bank | credit_card | securities`
- Core tables:
  - `users`
  - `accounts` (FK to users)
  - `categories` (FK to users)
  - `transactions` (FK to accounts, optional FK to categories)
- `transactions` key fields:
  - `date`, `amount`, `description`, `type`, `source`
  - optional AI-related fields: `aiCategoryId`, `aiConfidence`, `tags`
  - soft delete flag: `isDeleted`

## 6. API Surface (Current)

- `POST /api/import`
  - Input: `{ accountId: string, data: CommonTransaction[] }`
  - Behavior: validates payload, inserts into `transactions`, returns inserted count
- `GET /api/transactions`
  - Query params: `accountId`, `from`, `to`
  - Behavior: applies optional filters and returns latest records (limit 100)

## 7. CSV Normalization Design

- Institution-specific columns are isolated under `lib/csv/mappings/`.
- `getMappingById()` selects mapping by institution ID.
- `normalizeRows()` standardizes:
  - Date -> ISO date string (`YYYY-MM-DD`)
  - Amount -> numeric value
  - Description -> trimmed text
  - Type -> derived by mapping-specific logic or sign fallback
- Output unified format (`CommonTransaction`) is used for DB import.

## 8. Environment and Configuration

- Drizzle tooling does not auto-load `.env.local`; this project explicitly loads:
  - `.env.local`
  - `.env`
  in `drizzle.config.ts`.
- DB connection URL expected in `DATABASE_URL`.
- `docker-compose.yml` provides local PostgreSQL for development.

## 9. Scripts and Operational Commands

- App lifecycle:
  - `npm run dev`: start Next.js dev server
  - `npm run build`: production build + type checks
  - `npm run start`: run built app
- DB lifecycle:
  - `npm run db:generate`
  - `npm run db:migrate`
  - `npm run db:push`
  - `npm run db:studio`

## 10. Current State Notes (For AI Agents)

- Project still contains some template-era metadata/text in places (for example root metadata title/description).
- `README.md` is still mostly default template content and may not reflect actual architecture.
- Existing implementation mixes server components and API routes; architectural intent prefers server-first DB access where practical.
- There are project guidance rules in `AGENTS.md` and workspace rules (including Next.js version caution and app structure constraints).

## 11. Change Safety Checklist (When AI Edits This Repo)

- Prefer updating source-of-truth paths under root `app/` and `lib/`.
- Keep CSV institution logic additive (add new mapping file rather than hardcoding in normalizer).
- Preserve `CommonTransaction` compatibility unless performing coordinated schema/API migration.
- Run at minimum:
  - `npm run build`
  - lint command configured in your environment (if used in current workflow)
- Avoid committing generated artifacts and local-only files.

## 12. Recommended Next Documentation Targets

- Replace default `README.md` with project-specific onboarding.
- Add ER diagram or schema markdown for `users/accounts/categories/transactions`.
- Add API contract examples for `POST /api/import` and `GET /api/transactions`.
- Add institution mapping matrix (supported columns and caveats per bank/broker).
