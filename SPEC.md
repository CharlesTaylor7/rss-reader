# Frontend:

## Navigation

- Home View
- Posts View
- Blogs View
- Import View
- Login/Logout

## Home View

- [x] Home page should redirect to /posts

## Posts View

- [ ] search posts
  - should search post titles and descriptions
- [x] sort by read status, then by publish date.
- [x] touch post to open, marks as read
- [x] grey out read posts
- [ ] infinite scroll
- [x] swipe left to ignore
- [x] swipe right to favorite

## Blogs View

- [x] Search blog by title
- [x] Show most newly added blogs first. ("sort_order" desc)
- [ ] Show's site favicon.
- [ ] Subscribe to a new blog
- [ ] Edit a blog's title, url.
- [ ] Archive a blog (stop fetching, and hide by default)
- [ ] Button to sync a blog's rss feed Stretch goal:
- manually sorted blog list
  - the "Trello way", sparse integer indexes 1000 apart, and inserts average the
    neighbors.
  - the "figma way", fractional lexicographic ordering. Use unbounded text
    columns. "midpoint" between "a", and "b" is "am". Append more letters ad
    infinitum. Also called "CRDT" way.

# Backend

- [x] Cron job to sync feeds

## Import view

- [x] Import OPML button.

## Browser Extension

It would be amazing if it was easy to add a website to my RSS feed quickly.
Don't know what it would look like
