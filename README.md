## Goals
- Demonstrate proficiency with .net stack.
- complete an app with a dotnet backend + React frontend the sake of talking confidently about it.


## Tech Stack
- ASP.NET 
- Entity Framework 
- React
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
https://learn.microsoft.com/en-us/ef/core/managing-schemas/scaffolding/?tabs=dotnet-core-cli
https://learn.microsoft.com/en-us/dotnet/standard/data/sqlite/connection-strings
https://learn.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-9.0&WT.mc_id=dotnet-35129-website&tabs=visual-studio
https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-9.0

### Rss & Atom spec
- [Rachel by the bay](https://rachelbythebay.com/w/2024/08/17/hash/)

### Misc
- [htmx](https://htmx.org/docs/)
- [cron](https://crontab.guru/)

## Deployments
- fly.io
