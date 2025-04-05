from defusedxml import ElementTree as Xml
import requests
from rss_reader.db import connect
from rss_reader.date import parse_date
import datetime as dt
import os


class Sync:
    def __init__(self):
        self.db = connect()

    def run(self):
        query = "SELECT * FROM blogs LEFT JOIN feeds ON blogs.id == feeds.blog_id"
        for row in self.db.execute(query):
            self.sync(row)

    def read_feed(self, blog: dict):
        response = requests.get(blog["xml_url"])
        return response.text

    def sync(self, blog):
        content = self.read_feed(blog)
        xml = Xml.fromstring(content)

        # for atom feeds
        for post in xml.iter("entry"):
            self.sync_post(blog, post)

        # for rss feeds
        for post in xml.iter("item"):
            self.sync_post(blog, post)

    def sync_post(self, blog, tag):
        """
        Syncs a post from an rss or atom feed.
        """
        post = {"blog_id": blog["id"], "published_at": None}
        for child in tag.iter():
            if child.tag == "title":
                post["title"] = child.text

            elif child.tag == "link":
                post["url"] = child.text

            # rss-only feeds
            elif child.tag == "pubDate":
                post["published_at"] = parse_date(child.text)

            # atom-only feeds
            elif child.tag == "published":
                post["published_at"] = parse_date(child.text)

        try:
            self.db.execute(
                """
                INSERT INTO posts(blog_id, title, url, published_at) 
                VALUES(:blog_id, :title, :url, :published_at)
                ON CONFLICT DO UPDATE SET
                    title=excluded.title,
                    published_at=excluded.published_at
            """,
                post,
            )
        except Exception as e:
            print(f"skipping post: {post}\n{e}")
