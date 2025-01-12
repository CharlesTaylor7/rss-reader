using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;
using RssReader.Services;

namespace RssReader.Pages;

public class BlogsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _context;
    private readonly ISyncFeedService _syncService;

    public BlogsModel(
        ILogger<IndexModel> logger,
        RssReaderContext context,
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
}
