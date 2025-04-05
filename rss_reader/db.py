import os
import sqlite3


def connect():
    volume = os.environ.get("VOLUME", "data")
    return connect_to_sqlite(f"{volume}/chuck.db")


def connect_to_sqlite(file_name: str) -> sqlite3.Connection:
    db = sqlite3.connect(
        file_name,
        # auto-commit mode
        isolation_level=None,
        # required for adapters to work
        detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES,
    )
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON;")
    return db
