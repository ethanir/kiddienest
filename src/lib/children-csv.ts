// CSV + date parsing for the bulk children import. Pure and dependency-free so
// the logic can be unit-tested in isolation (see children-csv.test.ts), kept
// out of the dialog component where it can't easily be exercised.

export const HEADER_ALIASES: Record<string, string[]> = {
  name: ["name", "full name", "fullname", "child", "child name", "childname", "student", "student name"],
  first: ["first", "first name", "firstname", "given name", "given"],
  last: ["last", "last name", "lastname", "surname", "family name"],
  room: ["room", "classroom", "class", "room name", "group"],
  birthdate: ["birthdate", "birthday", "dob", "date of birth", "born", "bday", "b-day"],
  allergies: ["allergies", "allergy", "allergens", "allergen"],
  emoji: ["emoji", "avatar", "icon"],
};

// Minimal RFC-4180-ish CSV parser: handles quoted fields, "" escapes, embedded
// commas/newlines, BOM, and CR/LF/CRLF line endings.
export function parseCsv(input: string): string[][] {
  let text = input;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (c === "\r") {
      i += 1;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  row.push(field);
  rows.push(row);

  // Drop fully-empty rows (e.g. trailing newline).
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

export function detectColumns(header: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  header.forEach((h, idx) => {
    const key = h.trim().toLowerCase();
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (map[field] === undefined && aliases.includes(key)) map[field] = idx;
    }
  });
  return map;
}

export function toIso(yearRaw: string, monthRaw: string, dayRaw: string): string | null {
  let y = yearRaw;
  if (y.length === 2) y = (Number(y) > 50 ? "19" : "20") + y;
  const mo = Number(monthRaw);
  const d = Number(dayRaw);
  if (!mo || !d || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y.padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// Lenient birthday parsing. Returns ISO (YYYY-MM-DD) or null — never throws,
// since birthday is optional.
export function parseDate(raw?: string): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (!t) return null;

  let m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) return toIso(m[1], m[2], m[3]);

  m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
  if (m) return toIso(m[3], m[1], m[2]); // assume M/D/Y

  const dt = new Date(t);
  if (!Number.isNaN(dt.getTime())) {
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
      dt.getDate(),
    ).padStart(2, "0")}`;
  }
  return null;
}
