import { MessageCircle, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppShell } from "@/components/careloop/app-shell";
import { messages } from "@/lib/demo-data";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default function MessagesPage() {
  return (
    <AppShell
      role="Messages"
      title="Parent and staff messaging"
      description="A controlled inbox for parent questions, classroom updates, staff communication, and announcements."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${cardBase} p-6`}>
          <h2 className="text-xl font-semibold">Inbox</h2>
          <div className="mt-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.from}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{message.from}</p>
                  {message.unread && <Badge className="rounded-full">Unread</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message.child} • {message.time}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message.preview}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBase} p-6`}>
          <div className="flex items-center gap-3">
            <MessageCircle className="size-6 text-slate-600 dark:text-slate-300" />
            <h2 className="text-xl font-semibold">Reply</h2>
          </div>
          <Textarea className="mt-5 min-h-44 rounded-xl" placeholder="Write a clear parent-friendly message..." />
          <Button className="mt-4 w-full rounded-full">
            <Send className="mr-2 size-4" />
            Send message
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
