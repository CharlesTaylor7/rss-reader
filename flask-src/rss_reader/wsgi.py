from rss_reader.app import app as application
from rss_reader import migrate

migrate.run()

# wsgi requires application to be in scope
__all__ = ["application"]

# fly.io stops machines that are idle, so this signal will usually not run.
# I am considering using fly to run syncs as a cron, but I am not doing that yet because I don't want to pay for it to be up all the time.

# import uwsgi
# from rss_reader.sync import Sync
# def sync_feeds(_signum: int):
#     Sync().run()
#
# # sync every 24 hours
# SIGNUM = 1
# uwsgi.add_timer(SIGNUM, 60 * 60 * 24)
# uwsgi.register_signal(SIGNUM, "", sync_feeds)
