using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;
using RssReader.Services;

namespace RssReader.Pages;

public class PostsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _context;
    private readonly ISyncFeedService _syncService;

    public PostsModel(
        ILogger<IndexModel> logger,
        RssReaderContext context,
        ISyncFeedService service
    )
    {
        _logger = logger;
        _context = context;
        _syncService = service;
    }

    public IEnumerable<Post> Posts => _context.Posts.OrderBy(p => p.PublishedAt);

    [BindProperty]
    public int? SyncBlogId { get; set; }

    public async Task<PageResult> OnPostAsync()
    {
        if (SyncBlogId is not null)
            await _syncService.SyncFeed(SyncBlogId.Value);
        return Page();
    }
}
