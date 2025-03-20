from defusedxml import ElementTree as Xml
import requests
from rss_reader.db import connect
from rss_reader.date import parse_date
import datetime as dt
import os

class Sync:
    def __init__(self):
        self.use_cache = os.environ.get('DEV_CACHE', False)
        self.db = connect()

    def run(self):
        for row in self.db.execute(
            "SELECT * FROM blogs left join feeds on blogs.id == feeds.blog_id"
        ):
            self.sync(row)

            
    def read_feed(self, blog: dict):
        if not self.use_cache:
            return requests.get(blog["xml_url"]).text

        id = blog['id']
        try:
            with open(f"dev-cache/{id}.xml", "r") as file:
                return file.read()
        except FileNotFoundError:
            content = requests.get(blog["xml_url"]).text
            with open(f"dev-cache/{id}.xml", "w") as file:
                file.write(content)
            return content

    def sync(self, blog):
        content = self.read_feed(blog)
        xml = Xml.fromstring(content)
        for post in xml.iter('entry'):
            self.sync_post(blog, post)

        for post in xml.iter('item'):
            self.sync_post(blog, post)

    def sync_post(self, blog, tag):
        post = { 'blog_id': blog['id'], 'published_at': None }
        for child in tag.iter():
            if child.tag == "title":
                post['title'] = child.text

            elif child.tag == "pubDate":
                post['published_at'] = parse_date(child.text)

            elif child.tag == "published":
                post['published_at'] = parse_date(child.text)

            elif child.tag == "link":
                post['url'] = child.text

        try:
            self.db.execute("""
                INSERT INTO posts(blog_id, title, url, published_at) 
                VALUES(:blog_id, :title, :url, :published_at)
                ON CONFLICT DO UPDATE SET
                    title=excluded.title,
                    published_at=excluded.published_at
            """,
                post
            )
        except Exception as e:
            print(f"skipping post: {post}\n{e}")
