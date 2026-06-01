"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";

import { LocalTime } from "@/components/careloop/local-time";
import { useRealtime } from "@/lib/use-realtime";
import { cn } from "@/lib/utils";
import { getMessages, sendMessage, type ChatMessage } from "@/app/app/messages/actions";

function senderLabel(m: ChatMessage) {
  return m.sender_name || (m.sender_role === "staff" ? "Daycare" : "Parent");
}

export function MessageThread({
  childId,
  viewerRole,
}: {
  childId: string;
  viewerRole: "staff" | "parent";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getMessages(childId).then((res) => {
      if (!active) return;
      setMessages(res.messages);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [childId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  // Live: pull new messages the moment either side sends one.
  useRealtime([{ table: "messages", filter: `child_id=eq.${childId}` }], () => {
    getMessages(childId).then((res) => setMessages(res.messages));
  });

  function send() {
    const value = text.trim();
    if (!value || pending) return;
    setError(null);
    setText("");
    startTransition(async () => {
      const res = await sendMessage(childId, value);
      if (res.error || !res.message) {
        setError(res.error ?? "Couldn't send. Please try again.");
        setText(value);
        return;
      }
      setMessages((m) => [...m, res.message as ChatMessage]);
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex h-full items-center justify-center py-10 text-slate-400 dark:text-slate-500">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {viewerRole === "parent"
                ? "Send a message to the daycare."
                : "Start the conversation with this family."}
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.sender_role === viewerRole;
            return (
              <div key={m.id} className={cn("flex animate-in fade-in-0 slide-in-from-bottom-1 duration-200", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2",
                    mine
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
                  )}
                >
                  {!mine ? (
                    <p className="mb-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {senderLabel(m)}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap break-words text-sm">{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      mine ? "text-emerald-100" : "text-slate-400 dark:text-slate-500",
                    )}
                  >
                    <LocalTime iso={m.created_at} />
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {error ? (
        <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20"
        />
        <button
          type="button"
          onClick={send}
          disabled={pending || !text.trim()}
          aria-label="Send message"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        </button>
      </div>
    </div>
  );
}
