"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, MessageCircle } from "lucide-react";

import { MessageThread } from "@/components/careloop/message-thread";
import {
  RoomFilterBar,
  matchesRoomAndQuery,
  useRoomFilter,
  type RoomLite,
} from "@/components/careloop/room-filter";
import { cn } from "@/lib/utils";

type ChildLite = {
  id: string;
  full_name: string;
  room: string | null;
  room_id: string | null;
  emoji: string | null;
  avatar_bg: string | null;
};

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export function StaffMessages({
  childList,
  rooms,
}: {
  childList: ChildLite[];
  rooms: RoomLite[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = childList.find((c) => c.id === selectedId) ?? null;
  const { roomId, setRoomId, query, setQuery } = useRoomFilter(rooms);

  const roomCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of childList) if (c.room_id) m[c.room_id] = (m[c.room_id] ?? 0) + 1;
    return m;
  }, [childList]);
  const visible = useMemo(
    () =>
      childList.filter((c) =>
        matchesRoomAndQuery(c, roomId, query, (x) => x.room_id, (x) => x.full_name),
      ),
    [childList, roomId, query],
  );

  if (childList.length === 0) {
    return (
      <div className={cn(cardBase, "p-10 text-center")}>
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <MessageCircle className="size-6 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-lg font-semibold">No conversations yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Add children first — then you can message their families here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr] [&>*]:min-w-0">
      <div className={cn(cardBase, "p-2", selected ? "hidden lg:block" : "block")}>
        {rooms.length > 0 || childList.length > 8 ? (
          <div className="p-2">
            <RoomFilterBar
              rooms={rooms}
              counts={roomCounts}
              totalCount={childList.length}
              roomId={roomId}
              onRoomChange={setRoomId}
              query={query}
              onQueryChange={setQuery}
              searchPlaceholder="Search families…"
            />
          </div>
        ) : null}
        <div className="space-y-1">
          {visible.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No families match{query ? ` “${query}”` : " this room"}.
            </p>
          ) : (
            visible.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                c.id === selectedId
                  ? "bg-emerald-50 dark:bg-emerald-500/10"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800",
              )}
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: c.avatar_bg ?? "#e2e8f0" }}
              >
                {c.emoji ?? "🙂"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.full_name}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {c.room || "Unassigned"}
                </p>
              </div>
            </button>
            ))
          )}
        </div>
      </div>

      <div
        className={cn(
          cardBase,
          "h-[70vh] flex-col p-4 lg:h-[calc(100vh-220px)] lg:min-h-[480px]",
          selected ? "flex" : "hidden lg:flex",
        )}
      >
        {selected ? (
          <>
            <div className="mb-3 flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Back to list"
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="size-5" />
              </button>
              <div
                className="flex size-9 items-center justify-center rounded-lg text-lg"
                style={{ background: selected.avatar_bg ?? "#e2e8f0" }}
              >
                {selected.emoji ?? "🙂"}
              </div>
              <div>
                <p className="font-semibold leading-tight">{selected.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Family conversation</p>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <MessageThread key={selected.id} childId={selected.id} viewerRole="staff" />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            Select a child to view the conversation.
          </div>
        )}
      </div>
    </div>
  );
}
