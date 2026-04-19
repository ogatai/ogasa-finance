import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

// drizzle-kit は Next.js と違い .env.local を自動読込しない
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default {
  // スキーマ定義ファイルの場所
  schema: "./lib/db/schema.ts",
  // マイグレーションファイルの出力先
  out: "./lib/db/migrations",
  // 使用するDBの種類
  dialect: "postgresql",
  dbCredentials: {
    // .env.localのDATABASE_URLを参照
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
