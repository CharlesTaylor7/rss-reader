import uwsgi
from rss_reader.app import app as application
from rss_reader import sync

def sync_feeds(_signum: int):
    sync.run()

# sync every 24 hours
SIGNUM = 1
uwsgi.add_timer(SIGNUM, 60 * 60 * 24)
uwsgi.register_signal(SIGNUM, "", sync_feeds)
