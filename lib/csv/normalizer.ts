// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\normalizer.ts
 
import type { RawRow, CommonTransaction, ColumnMapping } from "@/types/csv";
 
/**
 * 生のCSVデータを共通スキーマに変換する
 * @param rows DuckDBでパースした生データ
 * @param mapping 金融機関の列マッピング設定
 * @param sourceFileName インポート元ファイル名
 */
export function normalizeRows(
  rows: RawRow[],
  mapping: ColumnMapping,
  sourceFileName: string
): CommonTransaction[] {
  const results: CommonTransaction[] = [];
 
  for (const row of rows) {
    try {
      // 日付の変換（"2026/4/1" → "2026-04-01" のISO形式に統一）
      const rawDate = row[mapping.date];
      const date = parseDate(rawDate);
      if (!date) continue; // 日付が無効な行はスキップ
 
      // 金額の変換（カスタム関数があれば使用、なければ汎用パーサー）
      const rawAmount = row[mapping.amount];
      const amount = mapping.amountParser
        ? mapping.amountParser(rawAmount)
        : defaultAmountParser(rawAmount);
 
      // 摘要の取得
      const description = (row[mapping.description] ?? "").trim();
      if (!description) continue; // 摘要が空の行はスキップ
 
      // 取引タイプの判別
      const type = mapping.typeDetector
        ? mapping.typeDetector(row)
        : amount >= 0 ? "income" : "expense";
 
      results.push({ date, amount, description, type, source: sourceFileName });
    } catch (e) {
      // 変換エラーが出た行はスキップ（ログに記録）
      console.warn("行のパースに失敗:", row, e);
    }
  }
 
  return results;
}
 
/** 日付文字列をISO形式 "YYYY-MM-DD" に変換 */
function parseDate(raw: string): string | null {
  if (!raw) return null;
  // "2026/4/1" → Date → "2026-04-01"
  const d = new Date(raw.replace(/\//g, "-"));
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}
 
/** 数字文字列を数値に変換（カンマ・円記号を除去） */
function defaultAmountParser(raw: string): number {
  return parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
}
