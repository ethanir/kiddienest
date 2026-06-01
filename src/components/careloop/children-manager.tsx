"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChildFamilyDialog } from "@/components/careloop/child-family-dialog";
import { cn } from "@/lib/utils";
import { createChild, updateChild, type ChildRecord } from "@/app/app/children/actions";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

const AVATARS = [
  { emoji: "😊", bg: "#fce7f3" },
  { emoji: "🐻", bg: "#fef3c7" },
  { emoji: "🦊", bg: "#ffedd5" },
  { emoji: "🐰", bg: "#ede9fe" },
  { emoji: "🐥", bg: "#fef9c3" },
  { emoji: "🐸", bg: "#dcfce7" },
  { emoji: "🐙", bg: "#dbeafe" },
  { emoji: "🦄", bg: "#fae8ff" },
  { emoji: "🐢", bg: "#ccfbf1" },
  { emoji: "⭐", bg: "#ffe4e6" },
  { emoji: "🐝", bg: "#fef08a" },
  { emoji: "🦋", bg: "#e0f2fe" },
];

type FormState = {
  name: string;
  room: string;
  birthdate: string;
  allergies: string;
  emoji: string;
  bg: string;
};

const emptyForm: FormState = {
  name: "",
  room: "",
  birthdate: "",
  allergies: "",
  emoji: AVATARS[0].emoji,
  bg: AVATARS[0].bg,
};

export function ChildrenManager({ initialChildren }: { initialChildren: ChildRecord[] }) {
  const [children, setChildren] = useState<ChildRecord[]>(initialChildren);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [familyChild, setFamilyChild] = useState<ChildRecord | null>(null);
  const [familyOpen, setFamilyOpen] = useState(false);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  }

  function openEdit(child: ChildRecord) {
    setEditingId(child.id);
    setForm({
      name: child.full_name,
      room: child.room ?? "",
      birthdate: child.birthdate ?? "",
      allergies:
        child.allergies && child.allergies.trim().toLowerCase() !== "none"
          ? child.allergies
          : "",
      emoji: child.emoji ?? AVATARS[0].emoji,
      bg: child.avatar_bg ?? AVATARS[0].bg,
    });
    setError(null);
    setOpen(true);
  }

  function openFamily(child: ChildRecord) {
    setFamilyChild(child);
    setFamilyOpen(true);
  }

  function save() {
    if (!form.name.trim()) {
      setError("Please enter the child's name.");
      return;
    }
    setError(null);
    const input = {
      full_name: form.name,
      room: form.room,
      birthdate: form.birthdate || null,
      allergies: form.allergies,
      emoji: form.emoji,
      avatar_bg: form.bg,
    };
    startTransition(async () => {
      const res = editingId ? await updateChild(editingId, input) : await createChild(input);
      if (res.error || !res.child) {
        setError(res.error ?? "Something went wrong. Please try again.");
        return;
      }
      const saved = res.child;
      setChildren((cs) =>
        editingId
          ? cs.map((c) => (c.id === saved.id ? saved : c))
          : [...cs, saved].sort((a, b) => a.full_name.localeCompare(b.full_name)),
      );
      setOpen(false);
    });
  }

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {children.length === 0
            ? "No children yet"
            : `${children.length} ${children.length === 1 ? "child" : "children"}`}
        </p>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          Add child
        </button>
      </div>

      {children.length === 0 ? (
        <div className={cn(cardBase, "px-6 py-12 text-center")}>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            🧸
          </div>
          <h2 className="text-lg font-semibold">No children yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Add your first child to start tracking attendance and sharing daily updates with their
            parents.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Plus className="size-4" />
            Add child
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => {
            const hasAllergy =
              !!child.allergies && child.allergies.trim().toLowerCase() !== "none";
            return (
              <article key={child.id} className={cn(cardBase, "p-5")}>
                <div className="flex items-start gap-4">
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ background: child.avatar_bg ?? "#e2e8f0" }}
                  >
                    {child.emoji ?? "🙂"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold">{child.full_name}</h2>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {child.room || "Unassigned"}
                    </p>
                  </div>
                  <div className="-mr-1 -mt-1 flex shrink-0 gap-0.5">
                    <button
                      type="button"
                      onClick={() => openFamily(child)}
                      aria-label={`Manage ${child.full_name}'s parents`}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    >
                      <Users className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(child)}
                      aria-label={`Edit ${child.full_name}`}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <AttendanceBadge status={child.attendance_status} />
                  {hasAllergy ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      <AlertTriangle className="size-3" />
                      {child.allergies}
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!pending) setOpen(o);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? "Edit child" : "Add a child"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update this child's profile."
                : "Create a profile for a child in your care."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div>
              <p className="mb-2 text-sm font-medium">Avatar</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((a) => {
                  const selected = form.emoji === a.emoji && form.bg === a.bg;
                  return (
                    <button
                      key={a.emoji}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, emoji: a.emoji, bg: a.bg }))}
                      aria-label={`Choose ${a.emoji}`}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl text-xl transition",
                        selected
                          ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                          : "hover:scale-105",
                      )}
                      style={{ background: a.bg }}
                    >
                      {a.emoji}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Child's name">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className={inputCls}
                autoFocus
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Room">
                <input
                  value={form.room}
                  onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                  placeholder="e.g. Toddler Room"
                  className={inputCls}
                />
              </Field>
              <Field label="Birthday">
                <input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => setForm((f) => ({ ...f, birthdate: e.target.value }))}
                  className={cn(inputCls, "[color-scheme:light] dark:[color-scheme:dark]")}
                />
              </Field>
            </div>

            <Field label="Allergies">
              <input
                value={form.allergies}
                onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                placeholder="None"
                className={inputCls}
              />
            </Field>

            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingId ? "Save changes" : "Add child"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChildFamilyDialog
        child={familyChild}
        open={familyOpen}
        onOpenChange={(o) => setFamilyOpen(o)}
      />
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function AttendanceBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: typeof Clock; cls: string }> = {
    checked_in: {
      label: "Checked in",
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    not_arrived: {
      label: "Not arrived",
      icon: Clock,
      cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },
    absent: {
      label: "Absent",
      icon: XCircle,
      cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    },
    checked_out: {
      label: "Checked out",
      icon: ShieldCheck,
      cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
  };
  const m = map[status] ?? map.not_arrived;
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        m.cls,
      )}
    >
      <Icon className="size-3" />
      {m.label}
    </span>
  );
}
