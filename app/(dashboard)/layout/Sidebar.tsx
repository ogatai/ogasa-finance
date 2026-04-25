// ファイル: app/(dashboard)/layout/Sidebar.tsx
"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
 
const navItems = [
  { href: "/",            label: "ダッシュボード", emoji: "🏡" },
  { href: "/transactions",label: "取引一覧",       emoji: "📊" },
  { href: "/accounts",    label: "口座管理",       emoji: "🏦" },
  { href: "/import",      label: "CSVインポート",  emoji: "📥" },
];
 
export function Sidebar() {
  const pathname = usePathname();
 
  return (
    <aside className="w-52 min-h-screen bg-white border-r flex flex-col">
      {/* ロゴ */}
      <div className="p-4 border-b">
        <p className="font-mono font-bold text-sm text-slate-900">ogasa-finance</p>
        <p className="text-xs text-slate-400 mt-0.5">個人資産管理</p>
      </div>
 
      {/* ナビゲーション */}
      <nav className="p-2 flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-1",
              pathname === item.href
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <span className="text-base">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
