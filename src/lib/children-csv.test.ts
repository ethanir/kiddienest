import { describe, it, expect } from "vitest";

import { parseCsv, detectColumns, toIso, parseDate } from "./children-csv";

describe("parseCsv", () => {
  it("parses a simple comma-separated grid", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("keeps commas inside quoted fields", () => {
    expect(parseCsv('name,note\n"Smith, Jr.",hello')).toEqual([
      ["name", "note"],
      ["Smith, Jr.", "hello"],
    ]);
  });

  it('unescapes doubled quotes ("") inside a quoted field', () => {
    expect(parseCsv('q\n"she said ""hi"""')).toEqual([["q"], ['she said "hi"']]);
  });

  it("keeps newlines inside quoted fields", () => {
    expect(parseCsv('addr\n"line1\nline2"')).toEqual([["addr"], ["line1\nline2"]]);
  });

  it("handles CRLF line endings", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("strips a leading UTF-8 BOM", () => {
    const [[first]] = parseCsv("\uFEFFname,room\nMia,Infants");
    expect(first).toBe("name");
  });

  it("drops a trailing empty row from a final newline", () => {
    expect(parseCsv("a\nb\n")).toEqual([["a"], ["b"]]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });
});

describe("detectColumns", () => {
  it("maps known header aliases case-insensitively", () => {
    expect(detectColumns(["Full Name", "DOB", "Classroom"])).toEqual({
      name: 0,
      birthdate: 1,
      room: 2,
    });
  });

  it("ignores unrecognized headers", () => {
    expect(detectColumns(["foo", "bar"])).toEqual({});
  });

  it("trims whitespace and keeps the first matching column", () => {
    expect(detectColumns([" Name ", "name"])).toEqual({ name: 0 });
  });
});

describe("toIso", () => {
  it("zero-pads a valid year/month/day", () => {
    expect(toIso("2022", "4", "15")).toBe("2022-04-15");
  });

  it("expands a 2-digit year around the 1950 pivot", () => {
    expect(toIso("99", "1", "1")).toBe("1999-01-01");
    expect(toIso("05", "1", "1")).toBe("2005-01-01");
  });

  it("rejects out-of-range months and days", () => {
    expect(toIso("2020", "13", "1")).toBeNull();
    expect(toIso("2020", "2", "32")).toBeNull();
    expect(toIso("2020", "0", "5")).toBeNull();
  });
});

describe("parseDate", () => {
  it("parses ISO dates", () => {
    expect(parseDate("2022-04-15")).toBe("2022-04-15");
  });

  it("parses M/D/Y with slashes or dots", () => {
    expect(parseDate("4/15/2022")).toBe("2022-04-15");
    expect(parseDate("2022.4.15")).toBe("2022-04-15");
  });

  it("expands a 2-digit year in M/D/Y", () => {
    expect(parseDate("4/15/99")).toBe("1999-04-15");
  });

  it("returns null for an out-of-range M/D/Y", () => {
    expect(parseDate("13/15/2022")).toBeNull();
  });

  it("returns null for empty or missing input (birthday is optional)", () => {
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate("")).toBeNull();
    expect(parseDate("   ")).toBeNull();
  });

  it("returns null for unparseable text instead of throwing", () => {
    expect(parseDate("not a date")).toBeNull();
  });
});
