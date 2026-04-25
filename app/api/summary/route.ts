// ファイル: app/api/summary/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
}

export async function GET() {
  const { start, end } = getMonthRange();

  // 総資産（収入 - 支出）
  const balanceRows = await db
    .select({
      income: sql<number>`SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END)`,
      expense: sql<number>`SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END)`,
    })
    .from(transactions);

  const totalIncome = Number(balanceRows[0].income ?? 0);
  const totalExpense = Number(balanceRows[0].expense ?? 0);
  const totalBalance = totalIncome - totalExpense;

  // 今月の支出
  const monthlyRows = await db
    .select({
      expense: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "expense"),
        gte(transactions.date, start),
        lte(transactions.date, end)
      )
    );

  const monthlyExpense = Number(monthlyRows[0].expense ?? 0);

  // サブスク（tags に "サブスク" が含まれる）
  const fixedRows = await db
    .select({
      fixed: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "expense"),
        sql`'サブスク' = ANY(${transactions.tags})`
      )
    );

  const fixedCost = Number(fixedRows[0].fixed ?? 0);

  // 最近の取引（5件）
  const recent = await db.query.transactions.findMany({
    limit: 5,
    orderBy: (t, { desc }) => [desc(t.date)],
  });

  return NextResponse.json({
    totalBalance,
    monthlyExpense,
    fixedCost,
    recentTransactions: recent,
  });
}
