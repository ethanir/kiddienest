"use client";

import { useState, useTransition } from "react";
import {
  DoorOpen,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  createRoom,
  deleteRoom,
  updateRoom,
  type RoomRecord,
} from "@/app/app/rooms/actions";
import { cardBase } from "@/lib/ui";

type RoomWithCount = RoomRecord & { child_count: number };

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500";

export function RoomsManager({
  initialRooms,
  isAdmin,
}: {
  initialRooms: RoomWithCount[];
  isAdmin: boolean;
}) {
  const [rooms, setRooms] = useState<RoomWithCount[]>(initialRooms);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [maxPer, setMaxPer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [confirmRoom, setConfirmRoom] = useState<RoomWithCount | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalChildren = rooms.reduce((n, r) => n + r.child_count, 0);

  function openAdd() {
    setEditingId(null);
    setName("");
    setCapacity("");
    setMaxPer("");
    setError(null);
    setOpen(true);
  }
  function openEdit(room: RoomWithCount) {
    setEditingId(room.id);
    setName(room.name);
    setCapacity(room.capacity ? String(room.capacity) : "");
    setMaxPer(room.max_per_staff ? String(room.max_per_staff) : "");
    setError(null);
    setOpen(true);
  }

  function save() {
    setError(null);
    const cap = capacity.trim() ? Math.max(0, parseInt(capacity, 10) || 0) : null;
    const mps = maxPer.trim() ? Math.max(1, parseInt(maxPer, 10) || 0) : null;
    startTransition(async () => {
      if (editingId) {
        const res = await updateRoom(editingId, { name, capacity: cap, max_per_staff: mps });
        if (res.error) return setError(res.error);
        setRooms((rs) =>
          rs.map((r) => (r.id === editingId ? { ...r, ...(res.room as RoomRecord) } : r)),
        );
      } else {
        const res = await createRoom(name, cap, mps);
        if (res.error) return setError(res.error);
        if (res.room) setRooms((rs) => [...rs, { ...res.room!, child_count: 0 }]);
      }
      setOpen(false);
    });
  }

  function confirmDelete() {
    if (!confirmRoom) return;
    const id = confirmRoom.id;
    setBusyId(id);
    startTransition(async () => {
      const res = await deleteRoom(id);
      setBusyId(null);
      if (res.error) {
        setError(res.error);
        setConfirmRoom(null);
        return;
      }
      setRooms((rs) => rs.filter((r) => r.id !== id));
      setConfirmRoom(null);
    });
  }

  return (
    <div className="space-y-5 lg:flex lg:h-[calc(100vh-3rem)] lg:flex-col lg:overflow-hidden">
      {isAdmin ? (
        <div className="flex items-center justify-between gap-3 lg:shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {totalChildren} assigned
            </span>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Plus className="size-4" />
            Add room
          </button>
        </div>
      ) : null}

      {error && !open ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400 lg:shrink-0">
          {error}
        </p>
      ) : null}

      {rooms.length === 0 ? (
        <div className={cn(cardBase, "px-6 py-12 text-center")}>
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <DoorOpen className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No rooms yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {isAdmin
              ? "Create rooms like “Infant Room” or “Toddler A,” then assign children to them. Every staff screen can then filter by room."
              : "An admin hasn't set up any rooms yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {rooms.map((room) => {
            const over = room.capacity != null && room.child_count > room.capacity;
            return (
              <div key={room.id} className={cn(cardBase, "p-5")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <DoorOpen className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{room.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <Users className="size-3.5" />
                        <span className={cn(over && "font-medium text-amber-600 dark:text-amber-400")}>
                          {room.child_count}
                          {room.capacity != null ? ` / ${room.capacity}` : ""}
                        </span>
                        <span>children</span>
                      </p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(room)}
                        aria-label={`Edit ${room.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRoom(room)}
                        aria-label={`Delete ${room.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
                {over ? (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Over capacity by {room.child_count - (room.capacity ?? 0)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / edit dialog */}
      <Dialog open={open} onOpenChange={(o) => { if (!pending) setOpen(o); }}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? "Edit room" : "Add a room"}
            </DialogTitle>
            <DialogDescription>
              Name the room and, optionally, set how many children it can hold.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Room name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="e.g. Toddler Room"
                className={inputCls}
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Capacity <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value.replace(/[^0-9]/g, ""))}
                type="text"
                inputMode="numeric"
                placeholder="e.g. 15"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Children per teacher{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                value={maxPer}
                onChange={(e) => setMaxPer(e.target.value.replace(/[^0-9]/g, ""))}
                type="text"
                inputMode="numeric"
                placeholder="e.g. 6"
                className={inputCls}
              />
              <span className="mt-1.5 block text-xs text-slate-400 dark:text-slate-500">
                Used to flag understaffing on the dashboard (e.g. 6 means one teacher per 6
                children).
              </span>
            </label>
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
              {editingId ? "Save changes" : "Add room"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmRoom} onOpenChange={(o) => { if (!o && !pending) setConfirmRoom(null); }}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Delete room?</DialogTitle>
            <DialogDescription>
              {confirmRoom
                ? `“${confirmRoom.name}” will be removed.${
                    confirmRoom.child_count > 0
                      ? ` Its ${confirmRoom.child_count} ${
                          confirmRoom.child_count === 1 ? "child" : "children"
                        } will become unassigned — no child records are deleted.`
                      : ""
                  }`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setConfirmRoom(null)}
              disabled={!!busyId}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={!!busyId}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-70"
            >
              {busyId ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete room
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
