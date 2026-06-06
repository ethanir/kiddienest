const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

// Loading fallback for /app routes. Because it renders inside <AppChrome> (which
// lives in the layout and stays mounted), the sidebar and mobile nav remain
// visible while only this content area shows a skeleton — so navigating between
// staff screens feels instant with no flash.
export default function AppLoading() {
  return (
    <div className="animate-pulse">
      {/* Header placeholder (matches the AppShell header) */}
      <div className="mb-6 border-b border-slate-200 pb-5 md:pb-6 dark:border-slate-800">
        <div className="mb-2 h-6 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-8 w-64 max-w-full rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-2.5 hidden h-3 w-80 max-w-full rounded bg-slate-100 sm:block dark:bg-slate-800" />
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${cardBase} h-24`} />
        ))}
      </div>

      {/* Content cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`${cardBase} h-32`} />
        ))}
      </div>
    </div>
  );
}
