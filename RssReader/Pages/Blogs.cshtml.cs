using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class BlogsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _context;

    public BlogsModel(ILogger<IndexModel> logger, RssReaderContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IEnumerable<Blog> Blogs => _context.Blogs.OrderBy(b => b.Title);
}
