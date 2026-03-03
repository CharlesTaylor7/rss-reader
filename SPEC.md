# Navigation:

- Home View
- Posts View
- Blogs View
- Import View
- Login/Logout

## Home View

- [x] Home page should redirect to /posts
- [x] Visiting any part site should kick off a sync.
- [x] spamming refreshes shouldn't refetch feeds multiple times
  - mechanism, set a last refresh date in localstorage.
  - allow refreshing once an hour.
  - use middleware on the views

## Posts View

- [ ] search posts
  - should search post titles and descriptions
- [ ] sort by read status, then by publish date.
- [ ] show all posts, do infinite scroll
- [ ] swipe left to ignore
- [ ] swipe right to favorite
- [ ] click post to open in tab, (marks as read)

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

## Import view

- [x] Import OPML button.

## Browser Extension

It would be amazing if it was easy to add a website to my RSS feed quickly.
Don't know what it would look like
