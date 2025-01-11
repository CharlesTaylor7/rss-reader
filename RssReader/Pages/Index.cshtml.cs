using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

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

    public void OnGet() { }
}
