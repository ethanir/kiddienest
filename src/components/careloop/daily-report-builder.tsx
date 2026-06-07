"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Baby,
  Camera,
  CheckCircle2,
  ClipboardList,
  ImageUp,
  Loader2,
  Moon,
  Send,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import {
  RoomFilterBar,
  matchesRoomAndQuery,
  useRoomFilter,
  type RoomLite,
} from "@/components/careloop/room-filter";
import { cn } from "@/lib/utils";
import { createUpdate, type PostState } from "@/app/app/daily-report/actions";

type Child = {
  id: string;
  full_name: string;
  room: string;
  room_id: string | null;
  emoji: string;
  avatar_bg: string;
};

type ReportType = {
  label: string;
  title: string;
  defaultNote: string;
  icon: LucideIcon;
  color: string;
};

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

const reportTypes: ReportType[] = [
  { label: "Meal", title: "Meal update", defaultNote: "Ate most of lunch and drank water.", icon: Utensils, color: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" },
  { label: "Nap", title: "Nap update", defaultNote: "Started nap time and settled down calmly.", icon: Moon, color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" },
  { label: "Photo", title: "Photo shared", defaultNote: "A new classroom photo was shared with the family.", icon: Camera, color: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400" },
  { label: "Note", title: "Teacher note", defaultNote: "Had a great day and participated well in activities.", icon: ClipboardList, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Activity", title: "Activity update", defaultNote: "Practiced sharing, cleanup, colors, and group play.", icon: Sparkles, color: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400" },
  { label: "Incident", title: "Incident note", defaultNote: "Minor incident recorded. Parent signature may be needed.", icon: AlertTriangle, color: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
];

export function DailyReportBuilder({
  childProfiles,
  rooms,
}: {
  childProfiles: Child[];
  rooms: RoomLite[];
}) {
  const [selectedChildId, setSelectedChildId] = useState(childProfiles[0]?.id ?? "");
  const [selectedTypeLabel, setSelectedTypeLabel] = useState(reportTypes[0].label);
  const [note, setNote] = useState(reportTypes[0].defaultNote);
  const [state, formAction, pending] = useActionState<PostState, FormData>(
    createUpdate,
    null,
  );

  const selectedChild = useMemo(
    () => childProfiles.find((c) => c.id === selectedChildId) ?? childProfiles[0],
    [childProfiles, selectedChildId],
  );

  const selectedType = useMemo(
    () => reportTypes.find((t) => t.label === selectedTypeLabel) ?? reportTypes[0],
    [selectedTypeLabel],
  );

  const { roomId, setRoomId, query, setQuery } = useRoomFilter(rooms);
  const roomCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of childProfiles) if (c.room_id) m[c.room_id] = (m[c.room_id] ?? 0) + 1;
    return m;
  }, [childProfiles]);
  const visibleChildren = useMemo(
    () =>
      childProfiles.filter((c) =>
        matchesRoomAndQuery(c, roomId, query, (x) => x.room_id, (x) => x.full_name),
      ),
    [childProfiles, roomId, query],
  );

  const isPhoto = selectedType.label === "Photo";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  function clearPhoto() {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPhotoName(null);
    setPhotoPreview((url) => {
      if (url) URL.revokeObjectURL(url);
      return null;
    });
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      clearPhoto();
      return;
    }
    setPhotoName(file.name);
    setPhotoPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  }

  // Clear the chosen photo after a successful post, and when leaving Photo type.
  useEffect(() => {
    if (state?.success) clearPhoto();
  }, [state?.success]);

  useEffect(() => {
    if (!isPhoto) clearPhoto();
  }, [isPhoto]);

  // Revoke any object URL on unmount.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseType(type: ReportType) {
    setSelectedTypeLabel(type.label);
    setNote(type.defaultNote);
  }

  if (childProfiles.length === 0) {
    return (
      <div className={`${cardBase} p-8 text-center`}>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Baby className="size-6 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold">No children yet</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Add a child profile first, then you can post daily updates here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] [&>*]:min-w-0">
      <div className={`${cardBase} p-5 md:p-6`}>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Create parent update</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pick a child, choose an update type, write a note, and post.
          </p>
        </div>

        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          1. Select child
        </p>
        {rooms.length > 0 || childProfiles.length > 8 ? (
          <div className="mb-3">
            <RoomFilterBar
              rooms={rooms}
              counts={roomCounts}
              totalCount={childProfiles.length}
              roomId={roomId}
              onRoomChange={setRoomId}
              query={query}
              onQueryChange={setQuery}
              searchPlaceholder="Search children…"
            />
          </div>
        ) : null}
        {visibleChildren.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No children match{query ? ` “${query}”` : " this room"}.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleChildren.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors",
                  selectedChildId === child.id
                    ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-2xl"
                    style={{ background: child.avatar_bg }}
                  >
                    {child.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{child.full_name}</p>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {child.room || "—"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="mb-3 mt-6 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          2. Select update type
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {reportTypes.map((type) => {
            const active = selectedTypeLabel === type.label;
            return (
              <button
                key={type.label}
                type="button"
                onClick={() => chooseType(type)}
                className={cn(
                  "rounded-xl border p-4 text-left text-sm font-medium transition-colors",
                  active
                    ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
                )}
              >
                <div
                  className={cn(
                    "mb-3 flex size-11 items-center justify-center rounded-xl",
                    active
                      ? "bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900"
                      : type.color,
                  )}
                >
                  <type.icon className="size-6" />
                </div>
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`${cardBase} p-5 md:p-6`}>
        <form action={formAction}>
          <input type="hidden" name="childId" value={selectedChild?.id ?? ""} />
          <input type="hidden" name="type" value={selectedType.label} />
          <input type="hidden" name="title" value={selectedType.title} />

          {isPhoto ? (
            <div className="animate-in fade-in-0 duration-300">
              <p className="mb-3 mt-5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Add photo
              </p>
              <input
                ref={fileInputRef}
                type="file"
                name="photo"
                accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
                onChange={onPickFile}
                className="hidden"
                id="kn-photo-input"
              />
              {photoPreview ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Selected"
                    className="max-h-72 w-full bg-slate-100 object-cover dark:bg-slate-800"
                  />
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate text-sm text-slate-600 dark:text-slate-300">
                      {photoName}
                    </span>
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <X className="size-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="kn-photo-input"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-slate-700 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400">
                    <ImageUp className="size-6" />
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Tap to add a photo
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    JPG, PNG, WEBP or HEIC · up to 8 MB
                  </span>
                </label>
              )}
            </div>
          ) : null}

          <p className="mb-3 mt-5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {isPhoto ? "Caption" : "3. Write note"}
          </p>
          <Textarea
            name="body"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-36 rounded-xl text-base"
            placeholder="Write a short parent-friendly update..."
          />

          {state?.error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {state.error}
            </p>
          ) : null}
          {state?.success ? (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              {state.success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-base font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <Send className="size-5" />
                Post update
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
