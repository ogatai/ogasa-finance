@AGENTS.md
# ogasa-finance: AI Development Guidelines

## Project Overview
Next.js 15 (App Router) をベースとした個人財務管理プラットフォーム。複数の金融機関（CSV）を統合し、動的な視覚化と分析を提供することを目的とする。

## Coding Standards & Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Drizzle ORM + SQLite (lib/db)
- **Styling**: Tailwind CSS 4 (Modern utility-first)
- **Components**: shadcn/ui + Framer Motion (for dynamic UI)
- **Icons**: Lucide React
- **Validation**: Zod (for CSV normalization & Schema)

## Core Architectural Principles
1. **Server-First Logic**: データ取得やDB操作は可能な限り Server Components 及び Server Actions を使用し、API Route は外部連携用のみとする。
2. **Dynamic & Fluid UI**:
   - 静的なテーブルを避け、`framer-motion` を用いたインタラクティブな要素を採用する。
   - スケルトンローディング（Suspense）を必須とし、レイアウトシフトを防ぐ。
3. **CSV Scalability**:
   - `lib/csv/mappings/` に各金融機関の定義を独立させる。
   - 新規インポート追加時は、`lib/csv/normalizer.ts` を変更せず、`mappings/` への追加のみで完結する設計を維持する。

## Implementation Details
- **Naming**: 
  - Components: PascalCase (e.g., `TransactionCard.tsx`)
  - Logic/Utilities: camelCase (e.g., `parseCsv.ts`)
  - DB Schema: snake_case (Table names), camelCase (Columns)
- **Code Style**:
  - `const` を優先し、関数はアロー関数形式とする。
  - TypeScript の `interface` よりも `type` を推奨。
- **Modern UI Trends**:
  - グラスモーフィズム、微細なグラデーション、Bento Grid レイアウトの採用。
  - ダークモードへの完全対応（Tailwind `dark:` クラス）。

## Project-Specific Rules
- **Anti-Redundancy**: `ogasa-finance/` サブフォルダ内のファイルは重複である。常にプロジェクトルート直下の `app/`, `lib/` を真実のソースとして扱うこと。
- **UI Isolation**: `app/api/` ディレクトリ内に UI コンポーネント（Sidebar 等）を配置しない。UI は必ず `components/` または `app/(dashboard)/` 内に配置すること。
- **CSV Support Expansion**:
  - CSVパース時は `iconv-lite` 等を用いて Shift-JIS (CP932) の文字化けを考慮すること。
  - `Transaction` 型を厳格に守り、正規化プロセスで欠落したデータ（カテゴリー不明等）には初期値を割り当てる。

## Verification Workflow
1. **Plan First**: 実装前に必ず変更計画を `実装計画.md` 等で提示し、承認を得ること。
2. **Clean Check**: 実装後、不要な `.git/hooks/*.sample` や初期SVGファイル（next.svg等）が混入していないか確認すること。
3. **Build & Lint**: 変更後は必ず `npm run build` または `next lint` でエラーがないことを確認する。