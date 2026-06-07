"use client";

import { useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  importChildren,
  type ChildRecord,
  type ImportChildInput,
} from "@/app/app/children/actions";
import { parseCsv, detectColumns, parseDate } from "@/lib/children-csv";

// Same friendly palette the manual "Add child" form uses, so imported kids get
// consistent avatars.
const AVATARS = [
  { emoji: "😊", bg: "#fce7f3" },
  { emoji: "🐻", bg: "#fef3c7" },
  { emoji: "🦊", bg: "#ffedd5" },
  { emoji: "🐰", bg: "#ede9fe" },
  { emoji: "🐥", bg: "#fef9c3" },
  { emoji: "🐸", bg: "#dcfce7" },
  { emoji: "🐙", bg: "#dbeafe" },
  { emoji: "🦄", bg: "#fae8ff" },
  { emoji: "🐢", bg: "#ccfbf1" },
  { emoji: "⭐", bg: "#ffe4e6" },
  { emoji: "🐝", bg: "#fef08a" },
  { emoji: "🦋", bg: "#e0f2fe" },
];

const TEMPLATE =
  "name,room,birthdate,allergies\n" +
  "Mia Johnson,Toddler Room,2022-04-15,Peanuts\n" +
  "Noah Smith,Preschool,2021-09-02,None\n" +
  "Sofia Garcia,Infants,2024-07-30,Dairy\n";

function avatarFor(seed: string, i: number) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATARS[(h + i) % AVATARS.length];
}

type Parsed = {
  ready: ImportChildInput[];
  invalid: { line: number; reason: string }[];
  matchedRoomNames: string[];
  newRoomNames: string[];
  headerError: string | null;
};

const cardField =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20";

type ImportResultState = {
  created: number;
  roomsCreated: number;
  skipped: number;
  error?: string;
};

export function ChildrenImportDialog({
  open,
  onOpenChange,
  rooms,
  onImported,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: { id: string; name: string }[];
  onImported: (created: ChildRecord[]) => void;
}) {
  const [rawText, setRawText] = useState("");
  const [autoCreateRooms, setAutoCreateRooms] = useState(true);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResultState | null>(null);

  const existingRoomSet = useMemo(
    () => new Set(rooms.map((r) => r.name.trim().toLowerCase())),
    [rooms],
  );

  const parsed: Parsed = useMemo(() => {
    const empty: Parsed = {
      ready: [],
      invalid: [],
      matchedRoomNames: [],
      newRoomNames: [],
      headerError: null,
    };
    if (!rawText.trim()) return empty;

    const rows = parseCsv(rawText);
    if (rows.length === 0) return empty;

    const cols = detectColumns(rows[0]);
    const hasName = cols.name !== undefined || cols.first !== undefined;
    if (!hasName) {
      return {
        ...empty,
        headerError:
          "Couldn't find a name column. Make sure the first row has headers like: name, room, birthdate, allergies.",
      };
    }

    const dataRows = rows.slice(1);
    const ready: ImportChildInput[] = [];
    const invalid: { line: number; reason: string }[] = [];

    dataRows.forEach((r, idx) => {
      const line = idx + 2; // 1-based, accounting for header row
      const rawName =
        cols.name !== undefined
          ? r[cols.name] ?? ""
          : [cols.first !== undefined ? r[cols.first] : "", cols.last !== undefined ? r[cols.last] : ""]
              .filter(Boolean)
              .join(" ");
      const name = rawName.trim();
      if (!name) {
        invalid.push({ line, reason: "missing name" });
        return;
      }

      const roomName =
        cols.room !== undefined ? (r[cols.room] ?? "").trim() || null : null;
      const birthdate = parseDate(cols.birthdate !== undefined ? r[cols.birthdate] : undefined);
      const allergies =
        cols.allergies !== undefined ? (r[cols.allergies] ?? "").trim() || null : null;

      const avatar = avatarFor(name, idx);
      const providedEmoji = cols.emoji !== undefined ? (r[cols.emoji] ?? "").trim() : "";
      const emoji = providedEmoji && [...providedEmoji].length <= 3 ? providedEmoji : avatar.emoji;

      ready.push({
        full_name: name,
        room_name: roomName,
        birthdate,
        allergies,
        emoji,
        avatar_bg: avatar.bg,
      });
    });

    const matched = new Set<string>();
    const created = new Set<string>();
    for (const r of ready) {
      const n = r.room_name?.trim();
      if (!n) continue;
      if (existingRoomSet.has(n.toLowerCase())) matched.add(n);
      else created.add(n);
    }

    return {
      ready,
      invalid,
      matchedRoomNames: [...matched],
      newRoomNames: [...created],
      headerError: null,
    };
  }, [rawText, existingRoomSet]);

  function reset() {
    setRawText("");
    setResult(null);
    setAutoCreateRooms(true);
  }

  function close() {
    if (pending) return;
    onOpenChange(false);
    // Clear shortly after so the dialog content doesn't flicker while closing.
    setTimeout(reset, 200);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setResult(null);
      setRawText(String(reader.result ?? ""));
    };
    reader.readAsText(f);
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kiddienest-children-template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function runImport() {
    if (parsed.ready.length === 0) return;
    startTransition(async () => {
      const res = await importChildren(parsed.ready, { autoCreateRooms });
      if (res.children && res.children.length > 0) onImported(res.children);
      setResult({
        created: res.children?.length ?? 0,
        roomsCreated: res.roomsCreated ?? 0,
        skipped: parsed.invalid.length,
        error: res.error,
      });
    });
  }

  const childWord = (n: number) => (n === 1 ? "child" : "children");
  const roomWord = (n: number) => (n === 1 ? "room" : "rooms");

  const importLabel =
    autoCreateRooms && parsed.newRoomNames.length > 0
      ? `Import ${parsed.ready.length} ${childWord(parsed.ready.length)} + ${parsed.newRoomNames.length} ${roomWord(parsed.newRoomNames.length)}`
      : `Import ${parsed.ready.length} ${childWord(parsed.ready.length)}`;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Import children from a spreadsheet</DialogTitle>
          <DialogDescription>
            Upload or paste a CSV. We&apos;ll match rooms by name and show you a preview before
            anything is saved.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <ResultView
            result={result}
            onDone={close}
            onAgain={() => {
              setResult(null);
              setRawText("");
            }}
          />
        ) : (
          <div className="space-y-4 py-1">
            {/* Upload + template */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5">
                <Upload className="size-4" />
                Choose a .csv file
                <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
              </label>
              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Download className="size-4" />
                Template
              </button>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                …or paste rows here
              </p>
              <textarea
                value={rawText}
                onChange={(e) => {
                  setResult(null);
                  setRawText(e.target.value);
                }}
                rows={5}
                placeholder={"name,room,birthdate,allergies\nMia Johnson,Toddler Room,2022-04-15,Peanuts"}
                className={cn(cardField, "font-mono text-xs leading-5")}
              />
              <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                Columns we read: <span className="font-medium">name</span> (required), room,
                birthdate, allergies. Extra columns are ignored.
              </p>
            </div>

            {parsed.headerError ? (
              <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                {parsed.headerError}
              </p>
            ) : null}

            {parsed.ready.length > 0 ? (
              <>
                {/* Summary chips */}
                <div className="flex flex-wrap gap-2">
                  <Chip tone="emerald">
                    {parsed.ready.length} {childWord(parsed.ready.length)} ready
                  </Chip>
                  {parsed.matchedRoomNames.length > 0 ? (
                    <Chip tone="slate">
                      {parsed.matchedRoomNames.length} {roomWord(parsed.matchedRoomNames.length)} matched
                    </Chip>
                  ) : null}
                  {parsed.newRoomNames.length > 0 ? (
                    <Chip tone="amber">
                      {parsed.newRoomNames.length} new {roomWord(parsed.newRoomNames.length)}
                    </Chip>
                  ) : null}
                  {parsed.invalid.length > 0 ? (
                    <Chip tone="rose">
                      {parsed.invalid.length} skipped
                    </Chip>
                  ) : null}
                </div>

                {/* New rooms control */}
                {parsed.newRoomNames.length > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-500/30 dark:bg-amber-500/5">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={autoCreateRooms}
                        onChange={(e) => setAutoCreateRooms(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        <span className="font-medium">
                          Create {parsed.newRoomNames.length} new {roomWord(parsed.newRoomNames.length)}
                        </span>{" "}
                        found in the file. {autoCreateRooms ? "" : "If unchecked, those children import unassigned."}
                        <span className="mt-1.5 flex flex-wrap gap-1.5">
                          {parsed.newRoomNames.slice(0, 12).map((n) => (
                            <span
                              key={n}
                              className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-amber-400 dark:ring-amber-500/30"
                            >
                              {n}
                            </span>
                          ))}
                          {parsed.newRoomNames.length > 12 ? (
                            <span className="px-1 text-xs text-amber-600 dark:text-amber-400">
                              +{parsed.newRoomNames.length - 12} more
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </label>
                  </div>
                ) : null}

                {/* Preview table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    Preview {parsed.ready.length > 8 ? "(first 8)" : ""}
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parsed.ready.slice(0, 8).map((r, i) => {
                      const lower = r.room_name?.trim().toLowerCase();
                      const isNew = lower ? !existingRoomSet.has(lower) : false;
                      return (
                        <div key={`${r.full_name}-${i}`} className="flex items-center gap-3 px-3 py-2">
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-base"
                            style={{ background: r.avatar_bg }}
                          >
                            {r.emoji}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm font-medium">
                            {r.full_name}
                          </span>
                          <span className="hidden min-w-0 flex-1 truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                            {r.room_name ? (
                              <>
                                {r.room_name}
                                {isNew ? (
                                  <span className="ml-1.5 text-amber-600 dark:text-amber-400">
                                    {autoCreateRooms ? "· new" : "· unassigned"}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">Unassigned</span>
                            )}
                          </span>
                          <span className="hidden w-20 shrink-0 text-right text-xs text-slate-400 sm:block dark:text-slate-500">
                            {r.birthdate ?? "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {parsed.invalid.length > 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Skipping {parsed.invalid.length} row{parsed.invalid.length === 1 ? "" : "s"} with no
                    name (line{parsed.invalid.length === 1 ? "" : "s"}{" "}
                    {parsed.invalid.slice(0, 8).map((x) => x.line).join(", ")}
                    {parsed.invalid.length > 8 ? "…" : ""}).
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        )}

        {!result ? (
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={close}
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={runImport}
              disabled={pending || parsed.ready.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
              {importLabel}
            </button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function Chip({
  tone,
  children,
}: {
  tone: "emerald" | "slate" | "amber" | "rose";
  children: React.ReactNode;
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

function ResultView({
  result,
  onDone,
  onAgain,
}: {
  result: ImportResultState;
  onDone: () => void;
  onAgain: () => void;
}) {
  const ok = result.created > 0;
  return (
    <div className="py-2">
      <div className="flex flex-col items-center text-center">
        <div
          className={cn(
            "mb-3 flex size-12 items-center justify-center rounded-full",
            ok
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
          )}
        >
          {ok ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}
        </div>
        <h3 className="text-lg font-semibold">
          {ok
            ? `Imported ${result.created} ${result.created === 1 ? "child" : "children"}`
            : "Nothing was imported"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {result.roomsCreated > 0
            ? `Created ${result.roomsCreated} new ${result.roomsCreated === 1 ? "room" : "rooms"}. `
            : ""}
          {result.skipped > 0
            ? `Skipped ${result.skipped} row${result.skipped === 1 ? "" : "s"} with no name. `
            : ""}
          {result.error ? result.error : ok ? "They're on your roster now." : ""}
        </p>
      </div>

      <DialogFooter className="mt-5 gap-2 sm:gap-2">
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Import another file
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Done
        </button>
      </DialogFooter>
    </div>
  );
}
