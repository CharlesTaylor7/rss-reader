using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;
using RssReader.Services;

namespace RssReader.Pages;

public class BlogsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderDbContext _context;
    private readonly ISyncFeedService _syncService;

    public BlogsModel(
        ILogger<IndexModel> logger,
        RssReaderDbContext context,
        ISyncFeedService syncService
    )
    {
        _logger = logger;
        _context = context;
        _syncService = syncService;
    }

    public IEnumerable<Blog> Blogs => _context.Blogs.OrderBy(b => b.Title);

    [BindProperty]
    public int? SyncBlogId { get; set; }

    public async Task<PageResult> OnPostAsync()
    {
        if (SyncBlogId is not null)
            await _syncService.SyncFeed(SyncBlogId.Value);
        return Page();
    }

    [BindProperty]
    public int? RenameBlogId { get; set; }

    [BindProperty]
    public string BlogTitle { get; set; }

    public async Task<PageResult> OnPutAsync()
    {
        if (RenameBlogId is not null)
        {
            _context
                .Blogs.Where(blog => blog.Id == RenameBlogId)
                .ExecuteUpdate(e => e.SetProperty(e => e.Title, BlogTitle));
        }
        return Page();
    }
}
