import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bank: {
          // メガバンク風の深い緑
          primary: "#004731", 
          // 少し明るめの緑（成功やプラス収支用）
          success: "#028150", 
          // 背景用の落ち着いたグレー
          background: "#F4F7F6",
          // 境界線用の薄いグレー
          border: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
export default config;