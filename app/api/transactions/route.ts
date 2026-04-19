// ファイル: app\api\transactions\route.ts
 
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import { desc, eq, and, gte, lte } from "drizzle-orm";
 
// GET /api/transactions?accountId=xxx&from=2026-04-01&to=2026-04-30
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
 
  const result = await db
    .select()
    .from(transactions)
    .where(and(
      accountId ? eq(transactions.accountId, accountId) : undefined,
      from ? gte(transactions.date, new Date(from)) : undefined,
      to ? lte(transactions.date, new Date(to)) : undefined,
    ))
    .orderBy(desc(transactions.date))
    .limit(100);
 
  return NextResponse.json(result);
}
