using System.Xml;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderDbContext _context;
    private readonly IBlogImportService _blogImportService;

    public IndexModel(
        ILogger<IndexModel> logger,
        RssReaderDbContext context,
        IBlogImportService blogImportService
    )
    {
        _logger = logger;
        _context = context;
        _blogImportService = blogImportService;
    }

    [BindProperty]
    public IFormFile? Import { get; set; }

    public string? UploadMessage { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Import == null)
        {
            UploadMessage = "No file selected";
            return Page();
        }
        try
        {
            var importResult = await _blogImportService.ImportBlogsAsync(Import);
            UploadMessage = GenerateUploadMessage(importResult);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Opml import failed:\n{ex.Message}");
            UploadMessage = "Import failed";
        }

        return Page();
    }

    private string GenerateUploadMessage(ImportResult result)
    {
        var message = "";

        if (result.Imported == 0 && result.Renamed == 0 && result.Duplicates == 0)
            message = "No blogs found in uploaded file. Are you sure the XML is in OPML format?";

        if (result.Imported > 0)
            message += $"Imported {result.Imported} blogs.\n";

        if (result.Renamed > 0)
            message += $"Renamed {result.Renamed} blogs.\n";

        if (result.Duplicates > 0)
            message += $"Found {result.Duplicates} duplicates.\n";

        return message;
    }
}
