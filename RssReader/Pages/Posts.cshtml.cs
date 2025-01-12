using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;
using RssReader.Models;

namespace RssReader.Pages;

public class PostsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _context;

    public PostsModel(ILogger<IndexModel> logger, RssReaderContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IEnumerable<Post> Posts => _context.Posts.OrderBy(p => p.PublishedAt);

    [BindProperty]
    public int? SyncBlogId { get; set; }

    public async Task OnPostAsync()
    {
        if (SyncBlogId is null)
            return;

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            // LEFT JOIN
            /*
            var query =
                from blog in _context.Blogs
                join feed in _context.Feeds on blog.Id equals feed.BlogId into ordersGroup
                from order in ordersGroup.DefaultIfEmpty()
                select new { Feed = feed, Blog = blog };
            */
            foreach (var blog in _context.Blogs.Include(blog => blog.Feed))
            {
                /*var feed = blog.Feed ?? new Feed {*/
                /*    BlogId = blog.Id,*/
                /*    Blog = blog,*/
                /*    Hash*/
                /**/
                /*}*/
                _logger.LogInformation(blog.Feed.Etag);
            }
            await transaction.CommitAsync();
        }
    }
}

/*

    def run(self):
        for row in self.db.execute(
            "SELECT * FROM blogs left join feeds on blogs.id == feeds.blog_id"
        ):
            self.sync(row)

            
    def read_feed(self, blog: dict):
        if not self.use_cache:
            return requests.get(blog["xml_url"]).text

        id = blog['id']
        try:
            with open(f"dev-cache/{id}.xml", "r") as file:
                return file.read()
        except FileNotFoundError:
            content = requests.get(blog["xml_url"]).text
            with open(f"dev-cache/{id}.xml", "w") as file:
                file.write(content)
            return content

    def sync(self, blog):
        content = self.read_feed(blog)
        xml = Xml.fromstring(content)
        for post in xml.iter('entry'):
            self.sync_post(blog, post)

        for post in xml.iter('item'):
            self.sync_post(blog, post)

    def sync_post(self, blog, tag):
        post = { 'blog_id': blog['id'], 'published_at': None }
        for child in tag.iter():
            if child.tag == "title":
                post['title'] = child.text

            elif child.tag == "pubDate":
                post['published_at'] = parse_date(child.text)

            elif child.tag == "published":
                post['published_at'] = parse_date(child.text)

            elif child.tag == "link":
                post['url'] = child.text

        try:
            self.db.execute("""
                INSERT INTO posts(blog_id, title, url, published_at)
                VALUES(:blog_id, :title, :url, :published_at)
                ON CONFLICT DO UPDATE SET
                    title=excluded.title,
                    published_at=excluded.published_at
            """,
                post
            )
        except Exception as e:
            print(f"skipping post: {post}\n{e}")

            */
