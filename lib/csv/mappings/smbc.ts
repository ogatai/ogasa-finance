// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\mappings\smbc.ts
 
import type { ColumnMapping, RawRow } from "@/types/csv";
 
export const smbcMapping: ColumnMapping = {
  date: "取引年月日",
  amount: "取引金額（円）",
  description: "摘要",
 
  // 金額の正負でincome/expenseを判別
  typeDetector: (row: RawRow) => {
    const val = parseFloat(row["取引金額（円）"]?.replace(/,/g, "") ?? "0");
    return val >= 0 ? "income" : "expense";
  },
 
  // カンマ区切り数字をパース（例: "1,200" → 1200）
  amountParser: (raw: string) => {
    return parseFloat(raw.replace(/[^0-9.-]/g, ""));
  },
};
