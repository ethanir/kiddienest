import { cardBase } from "@/lib/ui";

// Rendered instantly (inside the persistent parent shell) while the next tab's
// data streams in — so tapping a tab feels immediate instead of frozen.
export default function ParentLoading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className={`${cardBase} p-5`}>
        <div className="flex items-center gap-4">
          <div className="size-16 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-5 w-40 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-6 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
      <div className={`${cardBase} space-y-4 p-5`}>
        <div className="h-4 w-36 rounded bg-slate-100 dark:bg-slate-800" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="size-10 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
