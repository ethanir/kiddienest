import { Baby } from "lucide-react";

import { MessageThread } from "@/components/careloop/message-thread";

import { loadParentChild } from "../shared";

const cardBase =
  "rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export default async function ParentMessagesPage() {
  const child = await loadParentChild();

  if (!child) {
    return (
      <div className={`${cardBase} p-8 text-center`}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <Baby className="size-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold">No child linked yet</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Once your daycare links your child, you can message their teachers here.
          </p>
      </div>
    );
  }

  const firstName = child.full_name.split(" ")[0];

  return (
    <>
      <section className={`${cardBase} flex h-[calc(100dvh-220px)] flex-col p-4 sm:p-5`}>
        <div className="mb-3">
          <h2 className="text-lg font-semibold tracking-tight">Messages</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Chat with {firstName}&apos;s teachers.
          </p>
        </div>
        <div className="min-h-0 flex-1">
          <MessageThread childId={child.id} viewerRole="parent" />
        </div>
      </section>
    </>
  );
}
