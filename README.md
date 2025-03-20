## Goals
- learn the RSS spec
- have better performance than InoReader, my current client
- have better visibility into data
- With more customizibility
- Secure 
- be really simple

## Tech Stack
- Python
- Flask
- Jinja2 (comes with Flask)
- sqlite
- htmx
- fly.io for hosting

## Feature set
- cron job runs nightly to check rss feeds
- you can also manually refresh a blog
- you can add a new blog
- no embedded posts view, read posts on host blog
- can favorite posts
- import opml rss feeds
I did this one manually for my existing feed using some nushell. But maybe make this feature so others can use my reader more easily?
 ```nu
open `Inoreader Feeds 20241104.xml` | get content.content.1.attributes | select title xmlUrl htmlUrl | save feeds.json
```

## Resources

### Rss & Atom spec
- [Rachel by the bay](https://rachelbythebay.com/w/2024/08/17/hash/)

### Misc
- [htmx](https://htmx.org/docs/)
- [cron](https://crontab.guru/)

### Python
- [flask](https://flask.palletsprojects.com/en/stable/quickstart/)
- [requests](https://pypi.org/project/requests/)
- [ormlite](https://ormlite.readthedocs.io/en/latest/ormlite.html#module-ormlite)
- [sqlite3](https://docs.python.org/3/library/sqlite3.html#sqlite3-reference)
- [eml.etree](https://docs.python.org/3/library/xml.etree.elementtree.html#module-xml.etree.ElementTree)

## Deployments
https://hynek.me/articles/docker-uv/
fly.io


## Scripts
Run dev server or dev command
- `uv run python -m rss_reader <dev-server|migrate|sync>`

Run prod server (locally)
- `uv run uwsgi uwsgi.ini`


## Export opml from Inoreader
https://www.inoreader.com/reader/subscriptions/export?download=1
