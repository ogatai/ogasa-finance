import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
 
// 環境変数からDB接続文字列を取得
const connectionString = process.env.DATABASE_URL!;
 
// PostgreSQLクライアントを作成
const client = postgres(connectionString);
 
// Drizzle ORMインスタンスをエクスポート
// 他のファイルから: import { db } from "@/lib/db"
export const db = drizzle(client, { schema });
