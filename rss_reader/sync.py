from defusedxml import ElementTree as Xml
import requests
import ormlite as orm
from rss_reader.models import Post, Feed
from rss_reader.db import connect

def run():
    main()

def main():
    db = connect()
    for row in db.execute(
        "SELECT * FROM blogs left join feeds on blogs.id == feeds.blog_id"
    ):
        sync(db, row)


def sync(db, blog):
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
        sync_post(db, blog, post)

    for post in xml.iter('item'):
        sync_post(db, blog, post)


def sync_post(db, blog, tag):
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

