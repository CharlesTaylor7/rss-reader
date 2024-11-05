import ormlite as orm
import os

def connect():
    volume = os.environ.get('VOLUME', "data")
    return orm.connect_to_sqlite(f"{volume}/chuck.db")
