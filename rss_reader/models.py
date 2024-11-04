import ormlite as orm
import datetime as dt
from typing import Optional

@orm.model("blogs")
class Blog:
    id: int = orm.field(pk=True)
    title: str
    xml_url: str

@orm.model("posts")
class Post:
    id: str = orm.field(pk=True)
    blog_id: int = orm.field(fk="blogs")
    external_id: str
    title: str
    url: str 
    published_at: Optional[str] = None
    # dt.datetime
    favorite: bool = False
    read_at: Optional[dt.datetime] = None

@orm.model("feeds")
class Feed:
    blog_id: int = orm.field(fk="blogs")
    hash: str
    etag: str
    last_modified: dt.datetime
