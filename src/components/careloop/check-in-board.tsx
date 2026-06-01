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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
        <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
          <CardContent className="p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Children</h2>
                <p className="careloop-muted text-sm text-slate-500">
                  Face first, status second, action last. Nothing is selected until you tap it.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAll}
                  className="h-11 rounded-full bg-white px-4 font-black"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Reset all
                </Button>

                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                  <ImagePlus className="size-4" />
                  Photo upload later
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {children.map((child) => (
                <article
                  key={child.name}
                  className="rounded-[2rem] border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedChild(child)}
                      className="shrink-0 rounded-[1.7rem] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-200"
                      aria-label={`Open ${child.name} details`}
                    >
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] text-3xl shadow-inner"
                        style={{ background: child.avatarBg }}
                      >
                        {child.emoji}
                      </div>
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-black text-slate-950">
                        {child.name}
                      </p>
                      <p className="text-sm font-medium text-slate-500">
                        {child.room}
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={child.liveStatus} />
                      </div>

                      <p className="mt-3 text-sm text-slate-600">
                        Pickup:{" "}
                        <span className="font-bold text-slate-900">
                          {child.pickup}
                        </span>
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-400">
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
                      activeClassName="bg-slate-800 text-white hover:bg-slate-900"
                      onClick={() => updateStatus(child.name, "absent")}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => updateStatus(child.name, "waiting")}
                      className="h-12 rounded-2xl bg-white text-sm font-black"
                    >
                      Reset
                    </Button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedChild(child)}
                    className="mt-2 h-10 w-full rounded-2xl text-sm font-black text-slate-600"
                  >
                    View pickup details
                  </Button>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[2rem] border-0 bg-slate-950 text-white shadow-xl shadow-slate-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Today’s status</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniStatus label="Checked in" value={counts.in.toString()} tone="green" />
                <MiniStatus label="Waiting" value={counts.waiting.toString()} tone="blue" />
                <MiniStatus label="Checked out" value={counts.out.toString()} tone="purple" />
                <MiniStatus label="Absent" value={counts.absent.toString()} tone="gray" />
              </div>
            </CardContent>
          </Card>

          <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Safe check-in flow</h2>
              <div className="mt-5 space-y-3">
                <Step icon={UserCheck} title="Confirm parent or pickup person" />
                <Step icon={KeyRound} title="Verify pickup PIN or signature" />
                <Step icon={Fingerprint} title="Save attendance record" />
              </div>
            </CardContent>
          </Card>

          <Card className="careloop-card rounded-[2rem] border-0 bg-white/85 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6">
              <h2 className="text-2xl font-black">Next build target</h2>
              <p className="careloop-muted mt-2 text-sm leading-6 text-slate-600">
                After this, we should make the staff daily report screen interactive:
                select child, choose meal/nap/photo/note, preview the parent timeline.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedChild)}
        onOpenChange={(open) => !open && setSelectedChild(null)}
      >
        <DialogContent className="rounded-[2rem] sm:max-w-xl">
          {selectedChild && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black">
                  {selectedChild.name}
                </DialogTitle>
                <DialogDescription>
                  Review pickup details before changing attendance.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] text-4xl"
                  style={{ background: selectedChild.avatarBg }}
                >
                  {selectedChild.emoji}
                </div>
                <div>
                  <StatusBadge status={selectedChild.liveStatus} />
                  <p className="mt-2 font-black">{selectedChild.room}</p>
                  <p className="text-sm text-slate-500">{selectedChild.age}</p>
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
                  activeClassName="bg-slate-800 text-white hover:bg-slate-900"
                  onClick={() => updateStatus(selectedChild.name, "absent")}
                />
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl bg-white font-black"
                  onClick={() => updateStatus(selectedChild.name, "waiting")}
                >
                  Reset
                </Button>
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
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className={`h-12 rounded-2xl text-sm font-black ${
        active ? activeClassName : "bg-white text-slate-800 hover:bg-slate-50"
      }`}
    >
      {label}
    </Button>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "checked-in") {
    return (
      <Badge className="w-fit justify-center whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800 hover:bg-emerald-100">
        <CheckCircle2 className="mr-1 size-3" />
        Checked in
      </Badge>
    );
  }

  if (status === "checked-out") {
    return (
      <Badge className="w-fit justify-center whitespace-nowrap rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-800 hover:bg-violet-100">
        <ShieldCheck className="mr-1 size-3" />
        Checked out
      </Badge>
    );
  }

  if (status === "absent") {
    return (
      <Badge className="w-fit justify-center whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100">
        <XCircle className="mr-1 size-3" />
        Absent
      </Badge>
    );
  }

  return (
    <Badge className="w-fit justify-center whitespace-nowrap rounded-full bg-sky-100 px-3 py-1.5 text-xs font-black text-sky-800 hover:bg-sky-100">
      <Clock className="mr-1 size-3" />
      Waiting
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
  const colors = {
    green: "bg-emerald-400 text-slate-950",
    blue: "bg-sky-300 text-slate-950",
    purple: "bg-violet-300 text-slate-950",
    gray: "bg-white/10 text-white",
  };

  return (
    <div className={`rounded-3xl p-4 text-center ${colors[tone]}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black leading-tight">{label}</p>
    </div>
  );
}

function Step({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="careloop-soft-card flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="size-6 text-slate-700" />
      </div>
      <p className="font-black">{title}</p>
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
    <div className="rounded-3xl border bg-white p-4">
      <Icon className="mb-3 size-5 text-slate-500" />
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
