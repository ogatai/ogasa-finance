// ファイル: components\import\CsvDropzone.tsx
"use client";
 
import { useState, useCallback } from "react";
import { parseCsvFile } from "@/lib/csv/parser";
import { normalizeRows } from "@/lib/csv/normalizer";
import { getMappingById } from "@/lib/csv/mappings";
import type { CommonTransaction, InstitutionId } from "@/types/csv";
 
interface Props {
  institutionId: InstitutionId;  // 選択中の金融機関
  onParsed: (rows: CommonTransaction[]) => void; // パース完了コールバック
}
 
export function CsvDropzone({ institutionId, onParsed }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("CSVファイルのみ対応しています");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      // 1. DuckDB-WASMでCSVをパース
      const rawRows = await parseCsvFile(file);
      // 2. 金融機関のマッピングで共通スキーマに変換
      const mapping = getMappingById(institutionId);
      const normalized = normalizeRows(rawRows, mapping, file.name);
      // 3. 親コンポーネントに結果を返す
      onParsed(normalized);
    } catch (e) {
      setError(`パースに失敗しました: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [institutionId, onParsed]);
 
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);
 
  return (
    <div
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => document.getElementById("csv-input")?.click()}
      className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center
                 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
    >
      <input
        id="csv-input" type="file" accept=".csv"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {isLoading ? (
        <p className="text-slate-500">⏳ パース中...</p>
      ) : fileName ? (
        <p className="text-green-600">✅ {fileName} を読み込みました</p>
      ) : (
        <>
          <p className="text-2xl mb-2">📄</p>
          <p className="text-slate-600">ここにCSVをドロップ</p>
          <p className="text-xs text-slate-400 mt-1">またはクリックして選択</p>
        </>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
