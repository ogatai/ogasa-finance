// ファイル: app\api\import\route.ts
 
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { transactions } from "@/lib/db/schema";
import type { CommonTransaction } from "@/types/csv";
 
// POST /api/import — フロントから送られたデータをDBに保存
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      accountId: string;
      data: CommonTransaction[];
    };
 
    // バリデーション
    if (!body.accountId || !body.data?.length) {
      return NextResponse.json({ error: "データが不正です" }, { status: 400 });
    }
 
    // Drizzle ORMでDB保存
    const inserted = await db.insert(transactions).values(
      body.data.map(t => ({
        accountId: body.accountId,
        date: new Date(t.date),
        amount: String(t.amount),
        description: t.description,
        type: t.type,
        source: t.source,
      }))
    ).returning();
 
    return NextResponse.json({
      success: true,
      imported: inserted.length,
    });
  } catch (error) {
    console.error("[import] エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
