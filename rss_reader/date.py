import re
import datetime as dt

__all__ = [parse_date]

DATE_PATTERNS: re.Pattern = [
    re.compile(pattern)
    for pattern in [
        r"^(?P<day_of_week>[a-zA-Z]{3}), (?P<day>(\d{1,2})) (?P<month>[a-zA-Z]+) (?P<year>\d{4})",
        r"^(?P<day_of_week>\w{3}), (?P<month>[a-zA-Z]+) (?P<day>(\d{1,2})) (?P<year>\d{4})",
        r"^(?P<day>\d{2}) (?P<month>[a-zA-Z]+) (?P<year>\d{4})$",
    ]
]

MONTHS: dict[string, int] = {
    "Jan": 1,
    "January": 1,
    "Feb": 2,
    "February": 2,
    "Mar": 3,
    "March": 3,
    "Apr": 4,
    "April": 4,
    "May": 5,
    "Jun": 6,
    "June": 6,
    "Jul": 7,
    "July": 7,
    "Aug": 8,
    "August": 8,
    "Sep": 9,
    "September": 9,
    "Oct": 10,
    "October": 10,
    "Nov": 11,
    "November": 11,
    "Dec": 12,
    "December": 12,
}


def parse_date(raw: str) -> str:
    """
    Rss feeds are the wild west when it comes to date formats.
    This attempts to parse the formats that I've encountered so far.
    """
    match = first_match(raw)
    if match is None:
        print("Encountered unknown date format:", raw)
        return raw

    year = int(match["year"])
    month = int(MONTHS[match["month"]])
    day = int(match["day"])
    return f"{year}-{month:02d}-{day:02d}"


def first_match(raw: str):
    for pattern in DATE_PATTERNS:
        match = pattern.match(raw)
        if match is not None:
            return match.groupdict()
