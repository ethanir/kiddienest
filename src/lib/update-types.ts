// The canonical daily-update types. The label is what's stored on rows (and
// keys each surface's icon/color maps); the title is the parent-facing
// headline. The report builder renders its buttons from this list and the
// server action validates against it — so the database only ever holds known
// types, and the two can't drift apart.

export const UPDATE_TYPES = [
  { label: "Meal", title: "Meal update" },
  { label: "Nap", title: "Nap update" },
  { label: "Photo", title: "Photo shared" },
  { label: "Note", title: "Teacher note" },
  { label: "Activity", title: "Activity update" },
  { label: "Incident", title: "Incident note" },
] as const;

export type UpdateTypeLabel = (typeof UPDATE_TYPES)[number]["label"];

// label → parent-facing title, for server-side derivation/validation.
export const UPDATE_TITLE_BY_LABEL: Record<string, string> = Object.fromEntries(
  UPDATE_TYPES.map((t) => [t.label, t.title]),
);
