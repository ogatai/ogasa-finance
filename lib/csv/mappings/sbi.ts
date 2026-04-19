// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\mappings\sbi.ts
 
import type { ColumnMapping } from "@/types/csv";
 
export const sbiMapping: ColumnMapping = {
  date: "約定日",
  amount: "受渡金額（円）",
  description: "銘柄名",
 
  // SBI証券は資産として扱う
  typeDetector: () => "asset",
 
  amountParser: (raw: string) => {
    return parseFloat(raw.replace(/[^0-9.-]/g, ""));
  },
};
