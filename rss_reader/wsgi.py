import uwsgi
from rss_reader.app import app as application
from rss_reader import migrate
from rss_reader.sync import Sync

migrate.run()

# fly.io stops machines that are idle, so this signal will usually not run.
# unless I disable auto stop machine
# def sync_feeds(_signum: int):
#     Sync().run()
#
# # sync every 24 hours
# SIGNUM = 1
# uwsgi.add_timer(SIGNUM, 60 * 60 * 24)
# uwsgi.register_signal(SIGNUM, "", sync_feeds)
