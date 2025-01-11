using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    public readonly RssReaderContext Db;

    public IndexModel(ILogger<IndexModel> logger, RssReaderContext db)
    {
        _logger = logger;
        Db = db;
    }

    public void OnGet() { }
}
