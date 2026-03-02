# Navigation: 
  - Home View
  - Posts View 
  - Blogs View
  - Import View 
  - Login/Logout

## Home View
  - [ ] Visiting the site should kick off a sync and then redirect to posts view.
  - [ ] spamming refreshes shouldn't refetch feeds multiple times

## Posts View
- [ ] search posts 
  - should search post titles and descriptions
- [ ] sort by read status, then by publish date. 
- [ ] show all posts, do infinite scroll
- [ ] swipe left to ignore
- [ ] swipe right to favorite
- [ ] click post to open in tab, (marks as read)


## Blogs View
- [ ] Show most newly added blogs first.  ("sort_order" desc)
- [ ] Subscribe to a new blog
- [ ] Edit a blog's title, url.
- [ ] Archive a blog (stop fetching, and hide by default)
- [ ] Button to sync a blog's rss feed
- [ ] default sort order is by last published
Stretch goal:
- manually sorted blog list
  - the "Trello way", sparse integer indexes 1000 apart, and inserts average the neighbors.
  - the "figma way", fractional lexicographic ordering. Use unbounded text columns. "midpoint" between "a", and "b" is "am". Append more letters ad infinitum. Also called "CRDT" way.

## Import view
- [x] Import OPML button. 


## Browser Extension
It would be amazing if it was easy to add a website to my RSS feed quickly.
Don't know what it would look like
