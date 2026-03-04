import { assertEquals } from "@std/assert";
import { parseDate } from "@/server/date.ts";

function dateOf(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

Deno.test("parse_date_rfc822 - RFC822 format: 'Wed, 02 Oct 2002'", () => {
  assertEquals(parseDate("Wed, 02 Oct 2002"), dateOf(2002, 10, 2));
  assertEquals(parseDate("Mon, 22 Jan 2024"), dateOf(2024, 1, 22));
});

Deno.test(
  "parse_date_simple_format - short month name format: '02 Oct 2002'",
  () => {
    assertEquals(parseDate("02 Oct 2002"), dateOf(2002, 10, 2));
    assertEquals(parseDate("22 Jan 2024"), dateOf(2024, 1, 22));
  },
);

Deno.test("parse_date_full_month_names - full month names", () => {
  assertEquals(parseDate("Wed, 02 October 2002"), dateOf(2002, 10, 2));
  assertEquals(parseDate("Mon, 22 January 2024"), dateOf(2024, 1, 22));
});

Deno.test("parse_date_iso_8601 - ISO 8601 format", () => {
  assertEquals(parseDate("2024-01-22"), dateOf(2024, 1, 22));
  assertEquals(parseDate("2024-1-2"), dateOf(2024, 1, 2));
});
