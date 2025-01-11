using System.Xml;
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

    public void OnGet() { }

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
                        _context.Blogs.Add(new Blog { XmlUrl = xmlUrl, Title = title });
                    }
                    else
                    {
                        blog.Title = title;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                _logger.LogError($"Opml import failed:\n{ex.Message}");
            }
        }

        return Page();
    }
}
