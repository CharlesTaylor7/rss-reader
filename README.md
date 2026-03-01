
Rss reader


I started on this like 3 times with different stacks

I am truing to go a little more product first for this go around:

- pwa so i can “install” it to my phone
- Mobile first app
- Swipe controls
- Free hosting; dont wanna pay for anything 
- Implies serverless

Spec:
- Starts refreshing rss feeds whenever i visit the site, 
- uses a db to save rss metadata and last fetch times etags, title, description etc.
- Uses auth so i can keep the site on the public web and not worry about someone screwing it up
- Google auth? Github auth?
- Home page is feed
- Feeds page to edit/add new feed
- Imports from inoreader export
- In feed oage swipe left to ignore
- Swipe right to favorite 
- Feed shows unread before read and in publish order and infinite scroll?
- Clicking a link should ooen a new tab me directly to the other page. Inoreader does an obnoxious iframe/webview thing around it.
- Clicking a link should flag it as “read”
- Dark mode
- Rounded corners
- Daisy?


Stack
- tailwind
- Daisyui
- Deno deploy
- Deno fresh (preact)
- Google oauth (sso)
- Postgres (neondb)

Db tables
Users

Feeds

Articles

