import { MessageCircle, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AppShell } from "@/components/careloop/app-shell";
import { messages } from "@/lib/demo-data";

export default function MessagesPage() {
  return (
    <AppShell
      role="Messages"
      title="Parent and staff messaging"
      description="A controlled inbox for parent questions, classroom updates, staff communication, and announcements."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">Inbox</h2>
            <div className="mt-4 space-y-3">
              {messages.map((message) => (
                <div key={message.from} className="rounded-3xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{message.from}</p>
                    {message.unread && <Badge className="rounded-full">Unread</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{message.child} • {message.time}</p>
                  <p className="mt-2 text-sm text-slate-600">{message.preview}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="size-7 text-slate-600" />
              <h2 className="text-2xl font-bold">Reply</h2>
            </div>
            <Textarea className="mt-5 min-h-44 rounded-3xl" placeholder="Write a clear parent-friendly message..." />
            <Button className="mt-4 w-full rounded-full">
              <Send className="mr-2 size-4" />
              Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
