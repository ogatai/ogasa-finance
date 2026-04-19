import {
    pgTable, uuid, text, numeric, timestamp, pgEnum, boolean
  } from "drizzle-orm/pg-core";
   
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Enum定義（選択肢の型）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
  // 取引タイプ：income(収入) / expense(支出) / asset(資産)
  export const transactionTypeEnum = pgEnum("transaction_type", [
    "income", "expense", "asset",
  ]);
   
  // 口座タイプ：bank(銀行) / credit_card(クレカ) / securities(証券)
  export const accountTypeEnum = pgEnum("account_type", [
    "bank", "credit_card", "securities",
  ]);
   
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // users テーブル — アプリのユーザー
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
   
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // accounts テーブル — 銀行口座・クレカ・証券口座
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  export const accounts = pgTable("accounts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),           // 例: "三井住友銀行 普通口座"
    type: accountTypeEnum("type").notNull(), // bank / credit_card / securities
    institution: text("institution").notNull(), // 例: "SMBC"
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
   
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // categories テーブル — 食費・固定費・投資など
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),    // 例: "食費"
    color: text("color").notNull(),  // 例: "#FF6B6B"（グラフ色）
    icon: text("icon"),              // 例: "🍜"（絵文字アイコン）
  });
   
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // transactions テーブル — 取引明細（CSVから取り込まれるデータ本体）
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  export const transactions = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .references(() => categories.id), // nullなら未分類
   
    // 共通スキーマ（CSVから変換されたデータ）
    date: timestamp("date").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description").notNull(), // 摘要・店舗名
    type: transactionTypeEnum("type").notNull(),
    source: text("source").notNull(),            // CSVファイル名
   
    // AI分類用（Phase 5で実装）
    aiCategoryId: uuid("ai_category_id")
      .references(() => categories.id),
    aiConfidence: numeric("ai_confidence", { precision: 4, scale: 3 }),
    tags: text("tags").array(),                  // ["サブスク", "毎月"]
   
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
  });
   
  // Drizzle用の型エクスポート（他ファイルで使用）
  export type User = typeof users.$inferSelect;
  export type Account = typeof accounts.$inferSelect;
  export type Category = typeof categories.$inferSelect;
  export type Transaction = typeof transactions.$inferSelect;
  export type NewTransaction = typeof transactions.$inferInsert;
  