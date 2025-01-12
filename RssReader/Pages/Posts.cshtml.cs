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
