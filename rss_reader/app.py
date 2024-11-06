from flask import Flask
from defusedxml import ElementTree as Xml
import flask

from rss_reader.db import connect

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
    blog = db.execute("select * from blogs where blogs.id = :id", {'id': id}).fetchone()
    return flask.render_template("fragment_blog_edit.jinja", blog=blog)

@app.route("/blogs/save", methods=["POST"])
def blog_save():
    blog = flask.request.form
    db = connect()
    db.execute("UPDATE blogs SET title=:title,xml_url=:xml_url WHERE id = :id", blog)
    return flask.render_template("fragment_blog.jinja", blog=blog)

@app.route("/posts")
def posts():
    db = connect()
    blog_id = flask.request.args.get('blog_id')
    if blog_id is not None:
        posts = db.execute("SELECT * FROM posts WHERE blog_id = :blog_id ORDER BY published_at DESC", flask.request.args)
    else:
        posts = db.execute("SELECT * FROM posts ORDER BY read, published_at DESC")

    return flask.render_template("posts.jinja", posts=posts)

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
             
