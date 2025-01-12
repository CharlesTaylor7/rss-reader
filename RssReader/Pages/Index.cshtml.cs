using System.Xml;
using EFCore.BulkExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RssReader.Models;

namespace RssReader.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly RssReaderContext _context;

    public IndexModel(ILogger<IndexModel> logger, RssReaderContext context)
    {
        _logger = logger;
        _context = context;
    }

    [BindProperty]
    public IFormFile? Import { get; set; }

    public string UploadMessage { get; set; }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Import == null)
        {
            UploadMessage = "No file selected";
            return Page();
        }

        var blogs = new List<Blog>();
        var renames = 0;
        var duplicates = 0;
        using (var transaction = await _context.Database.BeginTransactionAsync())
        using (var stream = Import.OpenReadStream())
        using (var reader = XmlReader.Create(stream, new XmlReaderSettings { Async = true }))
        {
            try
            {
                while (await reader.ReadAsync())
                {
                    if (reader.NodeType != XmlNodeType.Element || reader.Name != "outline")
                        continue;

                    reader.MoveToAttribute("title");
                    var title = reader.Value;

                    reader.MoveToAttribute("xmlUrl");
                    var xmlUrl = reader.Value;
                    var blog = _context.Blogs.FirstOrDefault(blog => blog.XmlUrl == xmlUrl);

                    if (blog is null)
                    {
                        blogs.Add(new Blog { XmlUrl = xmlUrl, Title = title });
                    }
                    else if (blog.Title == title)
                    {
                        duplicates++;
                    }
                    else
                    {
                        blog.Title = title;
                        renames++;
                    }
                }
                await _context.SaveChangesAsync();
                await _context.BulkInsertAsync(blogs);
                await transaction.CommitAsync();
                if (blogs.Count == 0 && renames == 0)
                    UploadMessage =
                        $"No blogs found in uploaded file. Are you sure the xml is opml format?";

                if (blogs.Count > 0)
                    UploadMessage += $"Imported {blogs.Count} blogs.\n";

                if (renames > 0)
                    UploadMessage += $"Renamed {renames} blogs.\n";

                if (renames > 0)
                    UploadMessage += $"Found {duplicates} duplicates.\n";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Opml import failed:\n{ex.Message}");
                UploadMessage = "Import failed";
            }
        }

        return Page();
    }
}
