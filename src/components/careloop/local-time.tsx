"use client";

import { useEffect, useState } from "react";

// Renders a timestamp in the viewer's local time, set after mount to avoid
// a server/client timezone mismatch.
export function LocalTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(
      new Date(iso).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    );
  }, [iso]);

  return <span suppressHydrationWarning>{label}</span>;
}
