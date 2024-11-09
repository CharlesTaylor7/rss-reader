import re

patterns = [
    re.compile(pattern) for pattern in [
        r'^(?P<day_of_week>[a-zA-Z]{3}), (?P<day>(\d{1,2})) (?P<month>[a-zA-Z]+) (?P<year>\d{4})',
        r'^(?P<day_of_week>\w{3}), (?P<month>[a-zA-Z]+) (?P<day>(\d{1,2})) (?P<year>\d{4})',
        r'^(?P<day>\d{2}) (?P<month>[a-zA-Z]+) (?P<year>\d{4})$'
    ]
]

months = {
    'Jan': 1,
    'January': 1,
    'Feb': 2,
    'February': 2,
    'Mar': 3,
    'March': 3,
    'Apr': 4,
    'April': 4,
    'May': 5,
    'Jun': 6,
    'June': 6,
    'Jul': 7,
    'July': 7,
    'Aug': 8,
    'August': 8,
    'Sep': 9,
    'September': 9,
    'Oct': 10,
    'October': 10,
    'Nov': 11,
    'November': 11,
    'Dec': 12,
    'December': 12,
}

def parse_date(raw: str):
    match = first_match(raw)
    if match is None:
        print(raw)
        return raw
    year = match['year']
    month = months[match['month']]
    day = match['day']
    iso = f'{year}-{month}-{day}'
    return iso

    
def first_match(raw: str):
    for pat in patterns:
        match = pat.match(raw)
        if match is not None:
            return match.groupdict()
