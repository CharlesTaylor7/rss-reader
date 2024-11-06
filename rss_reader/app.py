from flask import Flask
from defusedxml import ElementTree as Xml
import flask
import ormlite as orm

from rss_reader.db import connect
from rss_reader.models import Post, Blog

app = Flask(__name__)

@app.route("/")
def home():
    return flask.render_template("home.jinja")

@app.route("/blogs")
def blogs():
    db = connect()
    blogs = db.execute("select * from blogs")
    return flask.render_template("blogs.jinja", blogs=blogs)

@app.route("/blogs/<id>/edit")
def blog_edit(id):
    db = connect()
    blogs = orm.select(Blog).where(id=id).models(db)
    return flask.render_template("fragment_blog_edit.jinja", blog=blogs[0])

@app.route("/blogs/<id>/save", methods=["POST"])
def blog_save(id):
    blog = Blog(**flask.request.form)
    db = connect()
    orm.upsert(db, [blog], update=["title", "xml_url"])
    return flask.render_template("fragment_blog.jinja", blog=blog)

@app.route("/posts")
def posts():
    db = connect()
    blog_id = flask.request.args.get('blog_id')
    query = orm.select(Post)
    if blog_id:
        query = query.where(blog_id=blog_id)
    posts = query.models(db)
    return flask.render_template("posts.jinja", posts=posts)

@app.route("/posts/<id>/view")
def post_view(id):
    print(id)
    return ""

@app.route("/import", methods=["POST"])
def import_():
    tree = Xml.parse(flask.request.files['file'].stream)
    root = tree.getroot()
    blogs = [{'title': blog.attrib['title'], 'xml_url': blog.attrib['xmlUrl']} for blog in root.iter('outline') ]
    db = connect()
    db.executemany("""
        INSERT INTO blogs(title, xml_url) 
        VALUES(:title, :xml_url)
        ON CONFLICT DO UPDATE
        SET title=excluded.title
    """, blogs
    )

    return f"Imported {len(blogs)} blogs!"
             
