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
  
## Development Scripts
- Run dev server: `uv run python -m rss_reader dev-server`
- Sync all feeds: `uv run python -m rss_reader sync`
- Run migrations: `uv run python -m migrate`
- Run prod server (locally): `uv run uwsgi uwsgi.ini`

## Export from 3rd party rss reader
Every atom/atom rss reader under the sun uses the [OPML](https://en.wikipedia.org/wiki/OPML) file format for import & export of feeds.

For Inoreader, exporting is as simple as hitting this url while logged in:
https://www.inoreader.com/reader/subscriptions/export?download=1

## Resources

### Rss & Atom implementation notes
- [Rachel by the bay](https://rachelbythebay.com/w/2024/08/17/hash/)

### Misc
- [htmx](https://htmx.org/docs/)
- [cron](https://crontab.guru/)

### Python
- [flask](https://flask.palletsprojects.com/en/stable/quickstart/)
- [requests](https://pypi.org/project/requests/)
- [sqlite3](https://docs.python.org/3/library/sqlite3.html#sqlite3-reference)
- [eml.etree](https://docs.python.org/3/library/xml.etree.elementtree.html#module-xml.etree.ElementTree)
