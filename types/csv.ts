// ファイル: C:\Users\aktrt\Projects\ogasa-finance\types\csv.ts
 
// ────────────────────────────────────────────
// CSVをパースした生のデータ（金融機関ごとに異なる）
// ────────────────────────────────────────────
export type RawRow = Record<string, string>;
// 例: { "取引年月日": "2026/04/01", "摘要": "セブン", "取引金額": "-480" }
 
// ────────────────────────────────────────────
// 共通スキーマ（変換後のデータ）
// ────────────────────────────────────────────
export interface CommonTransaction {
  date: string;          // "2026-04-01" ISO形式
  amount: number;        // 正数=収入, 負数=支出
  description: string;   // "セブンイレブン 渋谷店"
  type: "income" | "expense" | "asset";
  source: string;        // インポート元ファイル名
}
 
// ────────────────────────────────────────────
// 列マッピング設定（金融機関ごとの設定）
// ────────────────────────────────────────────
export interface ColumnMapping {
  /** CSVの「日付」に相当する列名 */
  date: string;
  /** CSVの「金額」に相当する列名 */
  amount: string;
  /** CSVの「摘要」に相当する列名 */
  description: string;
  /** 収入・支出を判別する追加ロジック（省略可） */
  typeDetector?: (row: RawRow) => "income" | "expense" | "asset";
  /** 金額のマイナス記号や「円」を除去するカスタム関数（省略可） */
  amountParser?: (raw: string) => number;
}
 
// ────────────────────────────────────────────
// サポートする金融機関の識別子
// ────────────────────────────────────────────
export type InstitutionId = "smbc" | "rakuten" | "sbi" | "unknown";
