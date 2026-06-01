"use client";

import { useRouter } from "next/navigation";

import { useRealtime, type RealtimeSub } from "@/lib/use-realtime";

// Drop into a server-rendered page to make it live: re-runs the server
// component (router.refresh) whenever the watched tables change. Renders
// nothing.
export function RealtimeRefresh({ subscriptions }: { subscriptions: RealtimeSub[] }) {
  const router = useRouter();
  useRealtime(subscriptions, () => router.refresh());
  return null;
}
