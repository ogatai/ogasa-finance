// ファイル: app\(dashboard)\transactions\page.tsx
// ★ React Server Component — サーバー側でDBから直接データを取得
 
import { db } from "@/lib/db";
import { transactions, accounts, categories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/app/components/ui/badge";

// 取引タイプに対応するバッジカラー
const typeColors = {
  income: "bg-green-100 text-green-700",
  expense: "bg-red-100 text-red-700",
  asset: "bg-blue-100 text-blue-700",
} as const;
 
const typeLabels = {
  income: "収入",
  expense: "支出",
  asset: "資産",
} as const;
 
export default async function TransactionsPage() {
  // サーバー側でDBから取引データを100件取得
  const data = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(100);
 
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">取引一覧</h1>
 
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">日付</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">摘要</th>
              <th className="text-right px-4 py-3 text-slate-600 font-medium">金額</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">種別</th>
              <th className="text-left px-4 py-3 text-slate-600 font-medium">取込元</th>
            </tr>
          </thead>
          <tbody>
            {data.map(tx => (
              <tr key={tx.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500">
                  {new Date(tx.date).toLocaleDateString("ja-JP")}
                </td>
                <td className="px-4 py-3 font-medium">{tx.description}</td>
                <td className={`px-4 py-3 text-right font-mono font-semibold
                  ${Number(tx.amount) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {Number(tx.amount) >= 0 ? "+" : ""}
                  {Number(tx.amount).toLocaleString("ja-JP")}円
                </td>
                <td className="px-4 py-3">
                  <Badge className={typeColors[tx.type]}>
                    {typeLabels[tx.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{tx.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
