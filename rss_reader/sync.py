from defusedxml import ElementTree as Xml
import requests
import sqlite3
import ormlite as orm
from rss_reader.models import Post, Feed


db = orm.connect_to_sqlite("chuck.db")
db.row_factory = sqlite3.Row

def run():
    # sync({"id": 1, "xml_url": "https://paravoce.bearblog.dev/feed/"})
    main()

def main():
    for row in db.execute(
    "SELECT * FROM blogs left join feeds on blogs.id == feeds.blog_id"
    ):
        sync(row)


def sync(blog):
    id = blog["id"]
    try:
        with open(f"dev-cache/{id}.xml", "r") as file:
            content = file.read()
    except FileNotFoundError:
        content = requests.get(blog["xml_url"]).text
        with open(f"dev-cache/{id}.xml", "w") as file:
            file.write(content)

    xml = Xml.fromstring(content)
    for post in xml.iter('entry'):
        sync_post(blog, post)

    for post in xml.iter('item'):
        sync_post(blog, post)


def sync_post(blog, tag):
    post = { 'blog_id': blog['id'] }
    for child in tag.iter():
        if child.tag == "title":
            post['title'] = child.text

        elif child.tag == "pubDate":
            post['published_at'] = child.text

        elif child.tag == "published":
            post['published_at'] = child.text

        elif child.tag == "link":
            post['url'] = child.text

        elif child.tag == "guid":
            post['external_id'] = child.text
            post['id'] = str(blog['id']) + '#' + post['external_id']

    
    orm.upsert(db, [Post(**post)], update=["title", "url", "published_at"])

