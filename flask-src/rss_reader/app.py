from flask import Flask
from defusedxml import ElementTree as Xml
import flask
from flask_login import login_user, logout_user, login_required, current_user
from rss_reader.auth import login_manager, User
from rss_reader.db import connect

app = Flask(__name__)
app.config["SECRET_KEY"] = "your-secret-key"  # Change this to a secure secret key
login_manager.init_app(app)


@app.get("/login")
def get_login():
    return flask.render_template("login.jinja")


@app.post("/login")
def post_login():
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")
    if not email or not password:
        flask.flash("Email and password are required")
        return flask.redirect(flask.url_for("login"))

    user = User.get_by_email(email)
    if user is None or not user.check_password(password):
        flask.flash("Invalid email or password")
        return flask.redirect(flask.url_for("login"))

    login_user(user)
    next_page = flask.request.args.get("next")
    if not next_page or not next_page.startswith("/"):
        next_page = flask.url_for("index")
    return flask.redirect(next_page)


@app.get("/register")
def get_register():
    return flask.render_template("register.jinja")


@app.post("/register")
def post_register():
    email = flask.request.form.get("email")
    password = flask.request.form.get("password")
    if not email or not password:
        flask.flash("Email and password are required")
        return flask.redirect(flask.url_for("register"))

    user = User.create(email, password)
    if user is None:
        flask.flash("Email already registered")
        return flask.redirect(flask.url_for("register"))

    login_user(user)
    return flask.redirect(flask.url_for("index"))


@app.get("/logout")
@login_required
def logout():
    logout_user()
    return flask.redirect(flask.url_for("login"))


@app.get("/")
@login_required
def index():
    return flask.render_template("home.jinja")


@app.get("/blogs")
@login_required
def blogs():
    db = connect()
    blogs = db.execute("SELECT blogs.id, blogs.title FROM blogs")
    return flask.render_template("blogs.jinja", blogs=blogs)


@app.get("/blogs/new")
@login_required
def blogs_new():
    return flask.render_template("fragment_blog_new.jinja")


@app.post("/blogs/import")
@login_required
def import_blogs():
    tree = Xml.parse(flask.request.files["file"].stream)
    root = tree.getroot()
    if root is None:
        raise ValueError("Failed to parse XML file")
    blogs = [
        {"title": blog.attrib["title"], "xml_url": blog.attrib["xmlUrl"]}
        for blog in root.iter("outline")
    ]
    db = connect()
    db.executemany(
        """
        INSERT INTO blogs(title, xml_url) 
        VALUES(:title, :xml_url)
        ON CONFLICT DO UPDATE
        SET title=excluded.title
    """,
        blogs,
    )

    return f"Imported {len(blogs)} blogs!"


@app.get("/blogs/<id>/edit")
@login_required
def blog_edit(id):
    db = connect()
    blog = db.execute("SELECT * FROM blogs WHERE blogs.id = :id", {"id": id}).fetchone()
    return flask.render_template("fragment_blog_edit.jinja", blog=blog)


@app.post("/blogs/save")
@login_required
def blog_save():
    blog = flask.request.form
    db = connect()
    db.execute(
        """
        INSERT INTO blogs (xml_url, title) 
        VALUES(:xml_url, :title)
        ON CONFLICT DO UPDATE SET 
            title=excluded.title
    """,
        blog,
    )
    return flask.render_template("fragment_blog.jinja", blog=blog)


@app.get("/posts")
@login_required
def posts():
    db = connect()
    blog_id = flask.request.args.get("blog_id")
    if blog_id is not None:
        posts = db.execute(
            "SELECT * FROM posts WHERE blog_id = :blog_id ORDER BY published_at DESC",
            flask.request.args,
        )
    else:
        posts = db.execute("SELECT * FROM posts ORDER BY read, published_at DESC")

    posts = list(posts)
    return flask.render_template("posts.jinja", posts=posts)


@app.post("/posts/sync")
@login_required
def sync_posts():
    from rss_reader.sync import Sync

    Sync().run()
    return flask.redirect(flask.url_for("posts"))
