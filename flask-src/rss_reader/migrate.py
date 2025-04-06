import pathlib
import re
from os import listdir, path
from rss_reader.db import connect

regex = re.compile(r"^(?P<id>\d+)-(?P<name>.*?)\.sql$")


def run():
    db = connect()
    db.execute("""
        CREATE TABLE IF NOT EXISTS migrations(
            id INTEGER PRIMARY KEY,
            name TEXT
        ) WITHOUT ROWID;
    """)

    ids = {row["id"] for row in db.execute("SELECT id FROM migrations")}

    dir = pathlib.Path(__file__).parent.resolve()
    migrations = path.join(dir, "migrations")
    for filename in listdir(migrations):
        match = regex.match(filename)
        if match is None:
            continue
        id = int(match.group("id"))
        name = match.group("name")

        if id in ids:
            continue

        print(f"Running {filename}")
        with open(path.join(migrations, filename), "r") as file:
            script = file.read()

        db.execute("""BEGIN EXCLUSIVE TRANSACTION""")
        for sql in script.split(";"):
            db.execute(sql)
        db.execute(
            """
            INSERT INTO migrations(id, name) VALUES(:id, :name)
        """,
            {"id": id, "name": name},
        )
        db.execute("""END TRANSACTION""")

    print("Migrated!")
