from datetime import date
from rss_reader.date import parse_date


def test_parse_date_rfc822():
    """
    Test RFC822 format: "Wed, 02 Oct 2002"
    """
    assert parse_date("Wed, 02 Oct 2002") == date(2002, 10, 2)
    assert parse_date("Mon, 22 Jan 2024") == date(2024, 1, 22)


def test_parse_date_simple_format():
    """
    Test short month name format: "02 Oct 2002"
    """
    assert parse_date("02 Oct 2002") == date(2002, 10, 2)
    assert parse_date("22 Jan 2024") == date(2024, 1, 22)


def test_parse_date_full_month_names():
    """
    Test with full month names
    """
    assert parse_date("Wed, 02 October 2002") == date(2002, 10, 2)
    assert parse_date("Mon, 22 January 2024") == date(2024, 1, 22)


def test_parse_date_iso_8601():
    """
    ISO 8601
    """
    assert parse_date("2024-01-22") == date(2024, 1, 22)
    assert parse_date("2024-1-2") == date(2024, 1, 2)


def test_parse_date_invalid_date():
    """
    Valid date formats but the days don't exist
    """
    assert parse_date("31 Feb 2024") is None
    assert parse_date("00 Jan 2024") is None
    assert parse_date("32 Jan 2024") is None
