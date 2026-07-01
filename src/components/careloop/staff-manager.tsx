"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Plus, Trash2, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { SelectField } from "@/components/careloop/select-field";
import type { RoomLite } from "@/components/careloop/room-filter";
import { assignStaffRoom } from "@/app/app/rooms/actions";
import {
  cancelInvite,
  inviteStaff,
  revokeStaff,
  type StaffInvite,
  type StaffMember,
} from "@/app/app/staff/actions";
import { cardBase, inputCls } from "@/lib/ui";

const roleBadge: Record<string, string> = {
  admin: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  staff: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
};

export function StaffManager({
  members,
  invites,
  rooms,
  viewerId,
  isAdmin,
}: {
  members: StaffMember[];
  invites: StaffInvite[];
  rooms: RoomLite[];
  viewerId: string | null;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const roomNameById = Object.fromEntries(rooms.map((r) => [r.id, r.name]));

  function changeStaffRoom(member: StaffMember, roomId: string | null) {
    setError(null);
    setNotice(null);
    setBusyId(member.id);
    startTransition(async () => {
      const res = await assignStaffRoom(member.id, roomId);
      setBusyId(null);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  function sendInvite() {
    const e = email.trim();
    if (!e || !e.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await inviteStaff(e, role);
      if (res.error) {
        setError(res.error);
        return;
      }
      setEmail("");
      setNotice(
        res.status === "promoted"
          ? `${e} now has access.`
          : `Invite saved for ${e}. They'll get access when they sign up with that email.`,
      );
      router.refresh();
    });
  }

  function changeRole(member: StaffMember, newRole: string) {
    if (!member.email) return;
    setError(null);
    setNotice(null);
    setBusyId(member.id);
    startTransition(async () => {
      const res = await inviteStaff(member.email as string, newRole);
      setBusyId(null);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  function remove(member: StaffMember) {
    setError(null);
    setNotice(null);
    setBusyId(member.id);
    startTransition(async () => {
      const res = await revokeStaff(member.id);
      setBusyId(null);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  function removeInvite(inviteEmail: string) {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await cancelInvite(inviteEmail);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col lg:overflow-hidden">
      {isAdmin ? (
        <div className={cn(cardBase, "p-5 md:p-6 lg:shrink-0")}>
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="size-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold">Add a teacher</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Invite teammates by email — no extra charge. Staff can run check-in, post updates, and
            message families; admins can also manage the team.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="teacher@email.com"
              className={cn(inputCls, "sm:flex-1")}
            />
            <SelectField
              ariaLabel="Role"
              value={role}
              onValueChange={setRole}
              options={[
                { value: "staff", label: "Staff" },
                { value: "admin", label: "Admin" },
              ]}
              className="sm:w-40"
            />
            <button
              type="button"
              onClick={sendInvite}
              disabled={pending}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Send invite
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            If they already have an account they get access right away. Otherwise they&apos;re added
            the moment they sign up with that email.
          </p>
          {notice ? (
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          ) : null}
        </div>
      ) : error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="space-y-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
      <div className={cn(cardBase, "p-5 md:p-6")}>
        <h2 className="mb-4 text-lg font-semibold">Your team</h2>
        <div className="space-y-2">
          {members.map((m) => {
            const isSelf = m.id === viewerId;
            const label = m.full_name || m.email || "Team member";
            return (
              <div
                key={m.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {(label[0] ?? "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {label}
                    {isSelf ? (
                      <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>
                    ) : null}
                  </p>
                  {m.email ? (
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                  ) : null}
                  {!(isAdmin && !isSelf) && m.room_id ? (
                    <p className="truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {roomNameById[m.room_id] ?? "Room"}
                    </p>
                  ) : null}
                </div>
                {isAdmin && !isSelf ? (
                  <div className="flex items-center gap-2">
                    {rooms.length > 0 ? (
                      <SelectField
                        ariaLabel={`Room for ${label}`}
                        size="sm"
                        value={m.room_id ?? "none"}
                        onValueChange={(v) => changeStaffRoom(m, v === "none" ? null : v)}
                        disabled={busyId === m.id}
                        options={[
                          { value: "none", label: "No room" },
                          ...rooms.map((r) => ({ value: r.id, label: r.name })),
                        ]}
                      />
                    ) : null}
                    <SelectField
                      ariaLabel={`Role for ${label}`}
                      size="sm"
                      value={m.role}
                      onValueChange={(v) => changeRole(m, v)}
                      disabled={busyId === m.id}
                      options={[
                        { value: "staff", label: "Staff" },
                        { value: "admin", label: "Admin" },
                      ]}
                    />
                    <button
                      type="button"
                      onClick={() => remove(m)}
                      disabled={busyId === m.id}
                      aria-label={`Remove ${label}`}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                    >
                      {busyId === m.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      roleBadge[m.role] ?? roleBadge.staff,
                    )}
                  >
                    {m.role === "admin" ? "Admin" : "Staff"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isAdmin && invites.length > 0 ? (
        <div className={cn(cardBase, "p-5 md:p-6")}>
          <div className="mb-4 flex items-center gap-2">
            <Mail className="size-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold">Pending invites</h2>
          </div>
          <div className="space-y-2">
            {invites.map((inv) => (
              <div
                key={inv.email}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{inv.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Joins as {inv.role === "admin" ? "admin" : "staff"} when they sign up
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    roleBadge[inv.role] ?? roleBadge.staff,
                  )}
                >
                  {inv.role === "admin" ? "Admin" : "Staff"}
                </span>
                <button
                  type="button"
                  onClick={() => removeInvite(inv.email)}
                  disabled={pending}
                  aria-label={`Cancel invite for ${inv.email}`}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
