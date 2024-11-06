from defusedxml import ElementTree as Xml
import requests
from rss_reader.db import connect
import datetime as dt


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
    post = { 'blog_id': blog['id'], 'published_at': None }
    for child in tag.iter():
        if child.tag == "title":
            post['title'] = child.text

        elif child.tag == "pubDate":
            post['published_at'] = child.text

        elif child.tag == "published":
            post['published_at'] = child.text

        elif child.tag == "link":
            post['url'] = child.text

    try:
        db.execute("""
            INSERT INTO posts(blog_id, title, url, published_at) 
            VALUES(:blog_id, :title, :url, :published_at)
            ON CONFLICT DO UPDATE SET
                title=excluded.title,
                url=excluded.url,
                published_at=excluded.published_at
        """,
            post
        )
    except Exception as e:
        print(f"skipping post: {post}\n{e}")

