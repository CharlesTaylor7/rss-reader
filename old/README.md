## Project Goals
- learn the RSS spec
- better customizability
- better performance than InoReader, my current client
- be really simple


## Tech Stack
- Python
- Flask
- Jinja2
- Bootstrap 
- sqlite
- htmx
- fly.io for hosting
  
# Development 
This project is using `uv` to manage python versions, packages and development tools. [uv installation](https://docs.astral.sh/uv/getting-started/installation/)
## scripts
- Run dev server (w/ live reloading): `uv run rss_reader dev-server`
- Sync all feeds: `uv run rss_reader sync`
- Run migrations: `uv run rss_reader migrate`
- Run prod server: `uv run uwsgi uwsgi.ini`
- Add dependency: `uv add <dep>`
- Format code: `uv run ruff format`
- Lint code: `uv run ruff check`
- Typecheck code: `uv run pyright`
- Run test suite: `uv run pytest`

## Import my feeds from another rss reader
Nearly every atom/atom rss reader under the sun uses the [OPML](https://en.wikipedia.org/wiki/OPML) file format for import & export of feeds. You'll have to locate the export button.

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
