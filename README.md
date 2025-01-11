## Goals
- Demonstrate proficiency with a .net stack acquire a job

## Tech Stack
- ASP.NET
- Entitiy Framework Core
- Server side rendering
- React Router
- Fly.IO deployments
- sqlite

## Feature set
- sync button to check all rss feeds
- you can also manually refresh a blog
- you can add a new blog
- can favorite posts
- import opml rss feeds
- simple auth mechanism
I did this one manually for my existing feed using some nushell. But maybe make this feature so others can use my reader more easily?
 ```nu
open `Inoreader Feeds 20241104.xml` | get content.content.1.attributes | select title xmlUrl htmlUrl | save feeds.json
```

## Resources
https://learn.microsoft.com/en-us/ef/core/get-started/overview/first-app?tabs=netcore-cli

### Rss & Atom spec
- [Rachel by the bay](https://rachelbythebay.com/w/2024/08/17/hash/)

### Misc
- [htmx](https://htmx.org/docs/)
- [cron](https://crontab.guru/)

## Deployments
- fly.io
