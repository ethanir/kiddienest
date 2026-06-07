"use client";

import { useEffect, useState, useTransition } from "react";
import type { ReactNode } from "react";
import { Loader2, Mail, UserPlus, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getChildFamily,
  inviteParent,
  removeInvite,
  unlinkParent,
  type ChildInvite,
  type ChildParent,
} from "@/app/app/children/actions";

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ChildFamilyDialog({
  child,
  open,
  onOpenChange,
}: {
  child: { id: string; full_name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [parents, setParents] = useState<ChildParent[]>([]);
  const [invites, setInvites] = useState<ChildInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const childId = child?.id;
  useEffect(() => {
    if (!open || !childId) return;
    setError(null);
    setEmail("");
    setLoading(true);
    let active = true;
    getChildFamily(childId).then((res) => {
      if (!active) return;
      setParents(res.parents ?? []);
      setInvites(res.invites ?? []);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [open, childId]);

  function submitInvite() {
    if (!child) return;
    const value = email.trim();
    if (!value) {
      setError("Enter the parent's email.");
      return;
    }
    if (!emailRe.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await inviteParent(child.id, value);
      if (res.error) {
        setError(res.error);
        return;
      }
      const fresh = await getChildFamily(child.id);
      setParents(fresh.parents ?? []);
      setInvites(fresh.invites ?? []);
      setEmail("");
    });
  }

  function onRemoveInvite(id: string) {
    startTransition(async () => {
      const res = await removeInvite(id);
      if (res.error) {
        setError(res.error);
        return;
      }
      setInvites((xs) => xs.filter((i) => i.id !== id));
    });
  }

  function onUnlink(parentId: string) {
    if (!child) return;
    startTransition(async () => {
      const res = await unlinkParent(child.id, parentId);
      if (res.error) {
        setError(res.error);
        return;
      }
      setParents((xs) => xs.filter((p) => p.parent_id !== parentId));
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!pending) onOpenChange(o);
      }}
    >
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {child ? `${child.full_name.split(" ")[0]}'s parents` : "Parents"}
          </DialogTitle>
          <DialogDescription>
            Invite a parent by email. They&apos;ll see this child&apos;s updates once they sign in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitInvite();
              }}
              placeholder="parent@email.com"
              className={inputCls}
            />
            <button
              type="button"
              onClick={submitInvite}
              disabled={pending}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <UserPlus className="size-4" />
              )}
              Invite
            </button>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          ) : null}

          {loading ? (
            <div className="flex items-center justify-center py-6 text-slate-400 dark:text-slate-500">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (
            <>
              <Section title="Connected">
                {parents.length === 0 ? (
                  <Empty text="No parents connected yet." />
                ) : (
                  parents.map((p) => (
                    <Row key={p.parent_id}>
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        {initial(p.full_name, p.email)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {p.full_name || p.email || "Parent"}
                        </p>
                        {p.email ? (
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {p.email}
                          </p>
                        ) : null}
                      </div>
                      <RemoveBtn
                        label="Unlink parent"
                        onClick={() => onUnlink(p.parent_id)}
                        disabled={pending}
                      />
                    </Row>
                  ))
                )}
              </Section>

              {invites.length > 0 ? (
                <Section title="Pending invites">
                  {invites.map((i) => (
                    <Row key={i.id}>
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                        <Mail className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{i.email}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Pending — links when they sign in
                        </p>
                      </div>
                      <RemoveBtn
                        label="Remove invite"
                        onClick={() => onRemoveInvite(i.id)}
                        disabled={pending}
                      />
                    </Row>
                  ))}
                </Section>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function initial(name?: string | null, email?: string | null) {
  const s = (name && name.trim()) || (email && email.trim()) || "?";
  return s.charAt(0).toUpperCase();
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      {text}
    </p>
  );
}

function RemoveBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-red-400"
    >
      <X className="size-4" />
    </button>
  );
}
