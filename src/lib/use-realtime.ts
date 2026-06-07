"use client";

import { useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

export type RealtimeSub = { table: string; filter?: string };

// Subscribes to Postgres changes on the given tables and calls `onChange`
// (debounced) whenever any of them change. Keeps views live without a manual
// refresh. The callback should re-fetch through an RLS-protected query (or
// router.refresh) rather than trusting the socket payload — that keeps it
// secure and avoids flicker.
export function useRealtime(subs: RealtimeSub[], onChange: () => void) {
  const cb = useRef(onChange);
  // Keep the latest callback in a ref without writing it during render.
  useEffect(() => {
    cb.current = onChange;
  }, [onChange]);

  // Serialize so the effect only re-subscribes when the tables/filters change.
  const key = JSON.stringify(subs);

  useEffect(() => {
    const parsed = JSON.parse(key) as RealtimeSub[];
    const supabase = createClient();
    const suffix = Math.random().toString(36).slice(2);
    const channels: ReturnType<typeof supabase.channel>[] = [];
    let timer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const trigger = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => cb.current(), 120);
    };

    const setup = async () => {
      // Make sure the socket is authenticated as the current user so RLS lets
      // through exactly the rows they're allowed to see.
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session?.access_token) {
        supabase.realtime.setAuth(data.session.access_token);
      }
      parsed.forEach((s, i) => {
        const channel = supabase.channel(`rt-${s.table}-${i}-${suffix}`);
        channel.on(
          "postgres_changes",
          s.filter
            ? { event: "*", schema: "public", table: s.table, filter: s.filter }
            : { event: "*", schema: "public", table: s.table },
          trigger,
        );
        channel.subscribe();
        channels.push(channel);
      });
    };

    void setup();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [key]);
}
