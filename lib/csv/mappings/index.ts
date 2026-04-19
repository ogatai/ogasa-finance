// ファイル: C:\Users\aktrt\Projects\ogasa-finance\lib\csv\mappings\index.ts
 
import type { ColumnMapping, InstitutionId } from "@/types/csv";
import { smbcMapping } from "./smbc";
import { rakutenMapping } from "./rakuten";
import { sbiMapping } from "./sbi";
 
// 金融機関IDに対応するマッピングを返す関数
export function getMappingById(id: InstitutionId): ColumnMapping {
  const mappings: Record<string, ColumnMapping> = {
    smbc: smbcMapping,
    rakuten: rakutenMapping,
    sbi: sbiMapping,
  };
  if (!mappings[id]) {
    throw new Error(`未対応の金融機関: ${id}`);
  }
  return mappings[id];
}
