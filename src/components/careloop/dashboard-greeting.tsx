"use client";

import { useEffect, useState } from "react";

// A friendly header for the dashboard. The greeting and date are computed on the
// client so they reflect the viewer's local time (a server-rendered greeting
// would use UTC and could say "Good evening" at lunchtime). To stay
// hydration-safe, the first render shows a neutral placeholder and the real
// greeting/date fill in on mount.
export function DashboardGreeting({
  rooms,
  childrenCount,
}: {
  rooms: number;
  childrenCount: number;
}) {
  const [greeting, setGreeting] = useState("Welcome back");
  const [dateStr, setDateStr] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setDateStr(
      now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{greeting}</h1>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
        {dateStr ? `${dateStr} · ` : ""}
        {rooms} {rooms === 1 ? "room" : "rooms"} · {childrenCount}{" "}
        {childrenCount === 1 ? "child" : "children"}
      </p>
    </div>
  );
}
