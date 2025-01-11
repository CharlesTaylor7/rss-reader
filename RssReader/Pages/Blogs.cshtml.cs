using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class BlogsModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _db;

    public BlogsModel(ILogger<IndexModel> logger, RssReaderContext db)
    {
        _logger = logger;
        _db = db;
    }

    public IEnumerable<Blog> Blogs => _db.Blogs.OrderBy(b => b.Title);
}
