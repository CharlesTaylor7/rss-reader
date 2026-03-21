const DATE_PATTERNS: RegExp[] = [
  // rfc 822
  /^(?<day_of_week>[a-zA-Z]{3}), (?<day>\d{1,2}) (?<month>[a-zA-Z]+) (?<year>\d{4})/,
  // iso 8601
  /^(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})/,
  // misc
  /^(?<day_of_week>\w{3}), (?<month>[a-zA-Z]+) (?<day>\d{1,2}) (?<year>\d{4})/,
  /^(?<day>\d{2}) (?<month>[a-zA-Z]+) (?<year>\d{4})$/,
];

const MONTHS: Record<string, number> = {
  Jan: 1,
  January: 1,
  Feb: 2,
  February: 2,
  Mar: 3,
  March: 3,
  Apr: 4,
  April: 4,
  May: 5,
  Jun: 6,
  June: 6,
  Jul: 7,
  July: 7,
  Aug: 8,
  August: 8,
  Sep: 9,
  September: 9,
  Oct: 10,
  October: 10,
  Nov: 11,
  November: 11,
  Dec: 12,
  December: 12,
};

type MatchResult = { groups: Record<string, string>; pattern: RegExp };

/**
 * Returns named capture groups and the matched pattern.
 */
function firstMatch(raw: string): MatchResult | null {
  for (const pattern of DATE_PATTERNS) {
    const match = raw.match(pattern);
    if (match?.groups) {
      return { groups: match.groups as Record<string, string>, pattern };
    }
  }
  return null;
}

/**
 * RSS feeds are the wild west when it comes to date formats.
 * This attempts to parse the formats encountered so far.
 */
export function parseDate(raw?: string): Date | null {
  if (raw == null || raw == "") return null;
  const result = firstMatch(raw);

  if (result === null) {
    console.log(`Encountered unknown date format: ${raw}`);
    return null;
  }

  const { groups, pattern } = result;

  try {
    const year = parseInt(groups["year"], 10);
    const rawMonth = groups["month"];
    const month = /^\d+$/.test(rawMonth)
      ? parseInt(rawMonth, 10)
      : MONTHS[rawMonth];
    const day = parseInt(groups["day"], 10);

    if (!month) throw new Error(`Unknown month: ${rawMonth}`);

    // Date uses 0-indexed months
    const date = new Date(year, month - 1, day);
    return date;
  } catch (_e) {
    console.log(`Encountered unknown date format: ${raw}`);
    return null;
  }
}
