"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoomLite = { id: string; name: string };

// Per-screen room + name-search filter. "all" means no room filter. The
// selection is intentionally NOT persisted or shared across staff screens:
// each page (check-in, reports, messages) starts fresh on "all rooms" so a
// room chosen on one tab never silently carries over to another.
export function useRoomFilter() {
  const [roomId, setRoomId] = useState<string>("all");
  const [query, setQuery] = useState("");
  return { roomId, setRoomId, query, setQuery };
}

// True if an item passes the current room + name-search filter.
export function matchesRoomAndQuery<T>(
  item: T,
  roomId: string,
  query: string,
  getRoomId: (t: T) => string | null | undefined,
  getName: (t: T) => string,
): boolean {
  if (roomId !== "all" && getRoomId(item) !== roomId) return false;
  const q = query.trim().toLowerCase();
  if (q && !getName(item).toLowerCase().includes(q)) return false;
  return true;
}

export function RoomFilterBar({
  rooms,
  counts,
  totalCount,
  roomId,
  onRoomChange,
  query,
  onQueryChange,
  searchPlaceholder = "Search children…",
}: {
  rooms: RoomLite[];
  counts?: Record<string, number>;
  totalCount?: number;
  roomId: string;
  onRoomChange: (id: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  searchPlaceholder?: string;
}) {
  // With no rooms defined yet, only show the search box.
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          inputMode="search"
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {rooms.length > 0 ? (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip
            active={roomId === "all"}
            label="All rooms"
            count={totalCount}
            onClick={() => onRoomChange("all")}
          />
          {rooms.map((r) => (
            <Chip
              key={r.id}
              active={roomId === r.id}
              label={r.name}
              count={counts?.[r.id]}
              onClick={() => onRoomChange(r.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
      )}
    >
      {label}
      {typeof count === "number" ? (
        <span
          className={cn(
            "tabular-nums",
            active ? "text-white/70" : "text-slate-400 dark:text-slate-500",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
