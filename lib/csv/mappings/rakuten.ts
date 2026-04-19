// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\mappings\rakuten.ts
 
import type { ColumnMapping } from "@/types/csv";
 
export const rakutenMapping: ColumnMapping = {
  date: "利用日",
  amount: "利用金額",
  description: "利用店名・商品名",
 
  // 楽天カードは支出のみ → 常にexpense
  typeDetector: () => "expense",
 
  amountParser: (raw: string) => {
    // 数字以外を除去してマイナスにする（支出なので）
    return -Math.abs(parseFloat(raw.replace(/[^0-9.]/g, "")));
  },
};
