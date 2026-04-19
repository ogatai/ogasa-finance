import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

let _db: Db | undefined;

function getDb(): Db {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL が未設定です。Vercel では Project → Settings → Environment Variables に、本番用 Postgres（Neon / Supabase 等）の URL を設定してください。",
    );
  }

  const client = postgres(connectionString);
  _db = drizzle(client, { schema });
  return _db;
}

// ビルド時にモジュールが読み込まれても postgres() を走らせない（初回アクセス時に接続）
// 他のファイルから: import { db } from "@/lib/db"
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(real);
    }
    return value;
  },
});
