# load models, this is what enables the migrations
from rss_reader import models 
from rss_reader.db import connect

def run():
    db = connect()
    cursor = db.execute("""
        CREATE TABLE IF NOT EXISTS migrations(
        ) WITHOUT ROWID;
    """
    pass

