export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          ogasa-finance へようこそ
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          まずは
          <a
            href="/transactions"
            className="mx-1 font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
          >
            取引一覧
          </a>
          から確認してください。
        </p>
      </main>
    </div>
  );
}
