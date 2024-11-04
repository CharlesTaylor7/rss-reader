- [ ] Figure out deployments
    - need to decide on docker image to use
    - External dep on sqlite
    - migrations?
        - in order to simplify, we'll develop locally and just copy the local db file to prod.

## MVP
- [x] Edit a blog name
- [x] Sync a blog's rss feed
- [x] nav
- [ ] Save a new blog
- [ ] Parse published timestamps
- [ ] Save read_at timestamp for posts
- [ ] filter posts by blog
- [ ] sort posts by published and unread
- [ ] Sort blogs by last published
- [ ] Save feed meta data to avoid annoying retries

## Future
- [ ] favorite button
- [ ] import opml button
- [ ] Auth 
- [ ] multi-tenant
