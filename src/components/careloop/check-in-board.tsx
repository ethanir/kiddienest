"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Fingerprint,
  ImagePlus,
  KeyRound,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { children as demoChildren } from "@/lib/demo-data";

type AttendanceStatus = "checked-in" | "waiting" | "checked-out" | "absent";

type Child = (typeof demoChildren)[number] & {
  liveStatus: AttendanceStatus;
};

const starterChildren: Child[] = demoChildren.map((child) => ({
  ...child,
  liveStatus:
    child.attendance === "checked-in"
      ? "checked-in"
      : child.attendance === "absent"
        ? "absent"
        : "waiting",
}));

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export function CheckInBoard() {
  const [children, setChildren] = useState(starterChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const counts = useMemo(() => {
    return {
      in: children.filter((child) => child.liveStatus === "checked-in").length,
      waiting: children.filter((child) => child.liveStatus === "waiting").length,
      out: children.filter((child) => child.liveStatus === "checked-out").length,
      absent: children.filter((child) => child.liveStatus === "absent").length,
    };
  }, [children]);

  function updateStatus(childName: string, nextStatus: AttendanceStatus) {
    setChildren((currentChildren) =>
      currentChildren.map((child) =>
        child.name === childName ? { ...child, liveStatus: nextStatus } : child,
      ),
    );

    setSelectedChild((currentChild) =>
      currentChild?.name === childName
        ? { ...currentChild, liveStatus: nextStatus }
        : currentChild,
    );
  }

  function resetAll() {
    setChildren((currentChildren) =>
      currentChildren.map((child) => ({ ...child, liveStatus: "waiting" })),
    );
    setSelectedChild((currentChild) =>
      currentChild ? { ...currentChild, liveStatus: "waiting" } : null,
    );
  }

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className={cn(cardBase, "p-5 md:p-6")}>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Children</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Face first, status second, action last. Nothing is selected until you tap it.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <RotateCcw className="size-4" />
                Reset all
              </button>

              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <ImagePlus className="size-4" />
                Photo upload later
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => (
              <article
                key={child.name}
                className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedChild(child)}
                    className="shrink-0 rounded-2xl transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-500/30"
                    aria-label={`Open ${child.name} details`}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                      style={{ background: child.avatarBg }}
                    >
                      {child.emoji}
                    </div>
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold">{child.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{child.room}</p>

                    <div className="mt-2">
                      <StatusBadge status={child.liveStatus} />
                    </div>

                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      Pickup:{" "}
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {child.pickup}
                      </span>
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                      Allergy: {child.allergies}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <StatusButton
                    label="Check in"
                    active={child.liveStatus === "checked-in"}
                    activeClassName="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => updateStatus(child.name, "checked-in")}
                  />
                  <StatusButton
                    label="Check out"
                    active={child.liveStatus === "checked-out"}
                    activeClassName="bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() => updateStatus(child.name, "checked-out")}
                  />
                  <StatusButton
                    label="Absent"
                    active={child.liveStatus === "absent"}
                    activeClassName="bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100"
                    onClick={() => updateStatus(child.name, "absent")}
                  />
                  <StatusButton
                    label="Reset"
                    active={false}
                    activeClassName=""
                    onClick={() => updateStatus(child.name, "waiting")}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedChild(child)}
                  className="mt-2 h-10 w-full rounded-xl text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  View pickup details
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className={cn(cardBase, "p-6")}>
            <h2 className="text-xl font-semibold">Today&apos;s status</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStatus label="Checked in" value={counts.in.toString()} tone="green" />
              <MiniStatus label="Waiting" value={counts.waiting.toString()} tone="blue" />
              <MiniStatus label="Checked out" value={counts.out.toString()} tone="purple" />
              <MiniStatus label="Absent" value={counts.absent.toString()} tone="gray" />
            </div>
          </div>

          <div className={cn(cardBase, "p-6")}>
            <h2 className="text-xl font-semibold">Safe check-in flow</h2>
            <div className="mt-5 space-y-3">
              <Step icon={UserCheck} title="Confirm parent or pickup person" />
              <Step icon={KeyRound} title="Verify pickup PIN or signature" />
              <Step icon={Fingerprint} title="Save attendance record" />
            </div>
          </div>

          <div className={cn(cardBase, "p-6")}>
            <h2 className="text-xl font-semibold">Next build target</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              After this, we should make the staff daily report screen interactive:
              select child, choose meal/nap/photo/note, preview the parent timeline.
            </p>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedChild)}
        onOpenChange={(open) => !open && setSelectedChild(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-xl">
          {selectedChild && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  {selectedChild.name}
                </DialogTitle>
                <DialogDescription>
                  Review pickup details before changing attendance.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: selectedChild.avatarBg }}
                >
                  {selectedChild.emoji}
                </div>
                <div>
                  <StatusBadge status={selectedChild.liveStatus} />
                  <p className="mt-2 font-medium">{selectedChild.room}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedChild.age}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem icon={Phone} label="Pickup person" value={selectedChild.pickup} />
                <DetailItem icon={KeyRound} label="Pickup PIN" value="•••• 4821" />
                <DetailItem icon={AlertTriangle} label="Allergies" value={selectedChild.allergies} />
                <DetailItem icon={ShieldCheck} label="Authorized" value="Guardian verified" />
              </div>

              <div className="grid gap-2 sm:grid-cols-4">
                <StatusButton
                  label="Check in"
                  active={selectedChild.liveStatus === "checked-in"}
                  activeClassName="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => updateStatus(selectedChild.name, "checked-in")}
                />
                <StatusButton
                  label="Check out"
                  active={selectedChild.liveStatus === "checked-out"}
                  activeClassName="bg-violet-600 text-white hover:bg-violet-700"
                  onClick={() => updateStatus(selectedChild.name, "checked-out")}
                />
                <StatusButton
                  label="Absent"
                  active={selectedChild.liveStatus === "absent"}
                  activeClassName="bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100"
                  onClick={() => updateStatus(selectedChild.name, "absent")}
                />
                <StatusButton
                  label="Reset"
                  active={false}
                  activeClassName=""
                  onClick={() => updateStatus(selectedChild.name, "waiting")}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusButton({
  label,
  active,
  activeClassName,
  onClick,
}: {
  label: string;
  active: boolean;
  activeClassName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 rounded-xl text-sm font-medium transition-colors",
        active
          ? activeClassName
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
      )}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const map = {
    "checked-in": {
      icon: CheckCircle2,
      label: "Checked in",
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    "checked-out": {
      icon: ShieldCheck,
      label: "Checked out",
      cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
    absent: {
      icon: XCircle,
      label: "Absent",
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    waiting: {
      icon: Clock,
      label: "Waiting",
      cls: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    },
  } as const;

  const { icon: Icon, label, cls } = map[status];

  return (
    <Badge
      className={cn(
        "w-fit justify-center gap-1 whitespace-nowrap rounded-full border-transparent px-3 py-1 text-xs font-medium",
        cls,
      )}
    >
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}

function MiniStatus({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "blue" | "gray" | "purple";
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    blue: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
    purple: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    gray: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className={cn("rounded-xl p-4 text-center", tones[tone])}>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs font-medium leading-tight">{label}</p>
    </div>
  );
}

function Step({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <div className="flex size-10 items-center justify-center rounded-lg bg-white dark:bg-slate-900">
        <Icon className="size-5 text-slate-600 dark:text-slate-300" />
      </div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <Icon className="mb-2 size-5 text-slate-400 dark:text-slate-500" />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
