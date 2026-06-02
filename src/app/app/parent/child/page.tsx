import { Baby, HeartPulse, Home as HomeIcon, ShieldAlert } from "lucide-react";

import { ParentShell } from "@/components/careloop/parent-shell";
import { ParentIncidents } from "@/components/careloop/parent-incidents";
import { getIncidentsForChild } from "@/app/app/incidents/actions";

import { loadParentChild, requireParentUser } from "../shared";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default async function ParentChildPage() {
  await requireParentUser();
  const child = await loadParentChild();

  if (!child) {
    return (
      <ParentShell title="Child">
        <div className={`${cardBase} p-8 text-center`}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Baby className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No child linked yet</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Ask your daycare to invite you with this email to see your child&apos;s profile here.
          </p>
        </div>
      </ParentShell>
    );
  }

  const incidents = await getIncidentsForChild(child.id);

  return (
    <ParentShell
      title="Child"
      childName={child.full_name}
      childEmoji={child.emoji}
      childBg={child.avatar_bg}
    >
      <div className="space-y-5">
        {/* Profile header */}
        <section className={`${cardBase} p-6 text-center`}>
          <div
            className="mx-auto flex size-20 items-center justify-center rounded-3xl text-4xl shadow-sm"
            style={{ background: child.avatar_bg }}
          >
            {child.emoji}
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">{child.full_name}</h2>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Enrolled
          </span>
        </section>

        {/* Detail rows */}
        <section className={`${cardBase} divide-y divide-slate-100 dark:divide-slate-800`}>
          <DetailRow
            icon={<HomeIcon className="size-5" />}
            label="Classroom"
            value={child.room || "Not set"}
          />
          <DetailRow
            icon={<HeartPulse className="size-5" />}
            label="Allergies"
            value={child.allergies || "None on file"}
            highlight={Boolean(child.allergies) && child.allergies.toLowerCase() !== "none"}
          />
        </section>

        {/* Incident history */}
        <div>
          <div className="mb-3 flex items-center gap-2 px-1">
            <ShieldAlert className="size-4 text-slate-400 dark:text-slate-500" />
            <h3 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">
              Incident history
            </h3>
          </div>
          {incidents.length > 0 ? (
            <ParentIncidents childId={child.id} initial={incidents} />
          ) : (
            <div className={`${cardBase} p-6 text-center`}>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No incidents reported. 🎉
              </p>
            </div>
          )}
        </div>
      </div>
    </ParentShell>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{label}</p>
        <p
          className={
            highlight
              ? "font-semibold text-rose-600 dark:text-rose-400"
              : "font-medium text-slate-800 dark:text-slate-200"
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}
