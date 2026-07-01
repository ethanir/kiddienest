// Maps a Supabase/PostgREST error to something a person can act on: RLS
// denials (and PGRST116, which .single() raises when RLS filters every row
// out) become the supplied friendly message; anything else surfaces its own
// message. Shared so each action file doesn't grow its own copy.
export function rlsError(
  error: { message: string; code?: string },
  friendly: string,
): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("row-level security") || error.code === "PGRST116") {
    return friendly;
  }
  return error.message;
}
