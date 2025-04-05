import re
import datetime as dt
from typing import Optional, List, Dict, Tuple, Pattern

DATE_PATTERNS: List[Pattern[str]] = [
    re.compile(pattern)
    for pattern in [
        # rfc 822
        r"^(?P<day_of_week>[a-zA-Z]{3}), (?P<day>(\d{1,2})) (?P<month>[a-zA-Z]+) (?P<year>\d{4})",
        # iso 8601
        r"^(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$",
        # misc
        r"^(?P<day_of_week>\w{3}), (?P<month>[a-zA-Z]+) (?P<day>(\d{1,2})) (?P<year>\d{4})",
        r"^(?P<day>\d{2}) (?P<month>[a-zA-Z]+) (?P<year>\d{4})$",
    ]
]

MONTHS: Dict[str, int] = {
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


def parse_date(raw: str) -> Optional[str]:
    """
    Rss feeds are the wild west when it comes to date formats.
    This attempts to parse the formats that I've encountered so far.
    """
    result = first_match(raw)
    if result is None:
        print(f"Encountered unknown date format: {raw}")
        return None

    match_dict, _ = result
    try:
        year = int(match_dict["year"])
        month = int(MONTHS[match_dict["month"]])
        day = int(match_dict["day"])
        dt.date(year, month, day)
        return f"{year}-{month:02d}-{day:02d}"
    except Exception as e:
        print(f"Encountered unknown date format: {raw}")
        return None


def first_match(raw: str) -> Optional[Tuple[Dict[str, str], Pattern[str]]]:
    """
    Returns a dictionary of regex named match groups and the specific pattern that matched.
    """
    for pattern in DATE_PATTERNS:
        match = pattern.match(raw)
        if match is not None:
            return match.groupdict(), pattern
    return None


__all__ = ["parse_date"]
