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
  
# Development 
This project is using `uv` to manage python versions, packages and development tools. [uv installation](https://docs.astral.sh/uv/getting-started/installation/)
## scripts
- Run prod server: `uv run uwsgi uwsgi.ini`
- Add dependency: `uv add <dep>`
- Format code: `uvx run ruff format`
- Lint code: `uvx run ruff check`
- Typecheck code: `uv run pyright`
- Run test suite: `uv run pytest`
- Any django admin command: `uv run django-admin <subcommand>`

## Export from 3rd party rss reader
Every atom/atom rss reader under the sun uses the [OPML](https://en.wikipedia.org/wiki/OPML) file format for import & export of feeds.

For Inoreader, exporting is as simple as hitting this url while logged in:
https://www.inoreader.com/reader/subscriptions/export?download=1

## Resources

### Rss & Atom 
- [RSS Spec](https://www.rssboard.org/rss-specification)
- [Atom Spec](https://www.ietf.org/rfc/rfc4287.txt)
- [Rachel by the bay](https://rachelbythebay.com/w/2024/08/17/hash/)

### Misc
- [htmx](https://htmx.org/docs/)
- [cron](https://crontab.guru/)

### Python
- [flask](https://flask.palletsprojects.com/en/stable/quickstart/)
- [requests](https://pypi.org/project/requests/)
- [sqlite3](https://docs.python.org/3/library/sqlite3.html#sqlite3-reference)
- [eml.etree](https://docs.python.org/3/library/xml.etree.elementtree.html#module-xml.etree.ElementTree)
