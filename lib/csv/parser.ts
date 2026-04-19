// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\parser.ts
"use client"; // クライアントコンポーネントで使用する宣言
 
import * as duckdb from "@duckdb/duckdb-wasm";
import type { RawRow } from "@/types/csv";
 
// DuckDBインスタンスをキャッシュ（初期化は1回だけ行う）
let db: duckdb.AsyncDuckDB | null = null;
 
/**
 * DuckDBを初期化する（初回のみ数秒かかる）
 */
async function initDuckDB(): Promise<duckdb.AsyncDuckDB> {
  if (db) return db; // すでに初期化済みならキャッシュを返す
 
  // CDNからWASMバイナリを読み込む設定
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
 
  const worker = await duckdb.createWorker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
 
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
 
  return db;
}
 
/**
 * FileオブジェクトのCSVをパースしてRawRow[]を返す
 * @param file ユーザーがドロップしたCSVファイル
 * @returns 各行をオブジェクトにしたデータ配列
 */
export async function parseCsvFile(file: File): Promise<RawRow[]> {
  const database = await initDuckDB();
  const conn = await database.connect();
 
  try {
    // ブラウザのメモリにCSVファイルを登録
    await database.registerFileHandle(
      file.name,
      file,
      duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
      true
    );
 
    // SQLでCSVを読み込む（列名・型を自動推定）
    const result = await conn.query(
      `SELECT * FROM read_csv_auto('${file.name}', header=true)`
    );
 
    // Arrow形式のデータをJSONオブジェクト配列に変換
    return result.toArray().map(row => {
      const obj: RawRow = {};
      result.schema.fields.forEach(field => {
        obj[field.name] = String(row[field.name] ?? "");
      });
      return obj;
    });
  } finally {
    await conn.close();
  }
}
