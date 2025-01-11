using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _db;

    public IndexModel(ILogger<IndexModel> logger, RssReaderContext db)
    {
        _logger = logger;
        _db = db;
    }

    public void OnGet()
    {
        _logger.LogInformation("OnGet");
        using (var context = new RssReaderContext())
        {
            context.Blogs.Add(new Blog { Title = "Test blog", XmlUrl = " test url" });
        }
    }

    public List<Blog> Blogs => _db.Blogs.OrderBy(b => b.Title).Take(100).ToList();
}
