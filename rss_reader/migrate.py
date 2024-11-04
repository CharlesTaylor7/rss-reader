import ormlite as orm

# load models, this is what enables the migrations
from rss_reader import models 

def run():
    db = orm.connect_to_sqlite("chuck.db")
    orm.migrate(db)

