# load models, this is what enables the migrations
from rss_reader import models 
from rss_reader.db import connect
import ormlite as orm

def run():
    orm.migrate(connect())

