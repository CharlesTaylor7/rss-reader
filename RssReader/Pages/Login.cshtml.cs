using System.Xml;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class LoginModel : PageModel
{
    private readonly ILogger<LoginModel> _logger;
    private readonly RssReaderContext _context;
    private readonly IBlogImportService _blogImportService;

    public LoginModel(
        ILogger<LoginModel> logger,
        RssReaderContext context,
        IBlogImportService blogImportService
    )
    {
        _logger = logger;
        _context = context;
        _blogImportService = blogImportService;
    }

    public string? UploadMessage { get; set; }

    [BindProperty]
    public string Username { get; set; }

    [BindProperty]
    public string Password { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        throw new NotImplementedException();
    }
}
