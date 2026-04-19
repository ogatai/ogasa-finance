// ★ Next.js がビルド時にこのページを実行しないようにする（必須）
export const dynamic = "force-dynamic";

// ★ React Server Component — サーバー側でDBから直接データを取得
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";

export default async function TransactionsPage() {
  const data = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Transactions</h1>

      <div className="space-y-2">
        {data.map((t) => (
          <div key={t.id} className="p-3 border rounded">
            <div className="flex justify-between">
              <span>{t.title}</span>
              <Badge>{t.category}</Badge>
            </div>
            <div className="text-sm text-gray-500">
              {t.date?.toString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
