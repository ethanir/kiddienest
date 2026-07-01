// Canonical incident vocabulary. The server action validates against these
// lists, and both the staff and parent screens render from them — so the
// options offered, the values stored, and the badges shown can never drift
// apart.

export const INCIDENT_TYPES: readonly string[] = [
  "Injury",
  "Illness",
  "Behavior",
  "Other",
];

export const INCIDENT_SEVERITIES: readonly string[] = [
  "Minor",
  "Moderate",
  "Serious",
];

export const severityCls: Record<string, string> = {
  Minor: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  Moderate: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  Serious: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};
