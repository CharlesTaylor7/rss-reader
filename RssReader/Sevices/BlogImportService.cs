using System.Xml;
using EFCore.BulkExtensions;
using RssReader.Models;

public interface IBlogImportService
{
    Task<string> ImportBlogsAsync(IFormFile file);
}

public class BlogImportService : IBlogImportService
{
    private readonly RssReaderContext _context;
    private readonly ILogger<BlogImportService> _logger;

    public BlogImportService(RssReaderContext context, ILogger<BlogImportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<string> ImportBlogsAsync(IFormFile file)
    {
        if (file == null)
            return "No file selected";

        var blogs = new List<Blog>();
        var renames = 0;
        var duplicates = 0;

        using (var transaction = await _context.Database.BeginTransactionAsync())
        using (var stream = file.OpenReadStream())
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

                return GenerateUploadMessage(blogs.Count, renames, duplicates);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Opml import failed:\n{ex.Message}");
                return "Import failed";
            }
        }
    }

    private string GenerateUploadMessage(int imported, int renamed, int duplicates)
    {
        var message = "";

        if (imported == 0 && renamed == 0)
            message = "No blogs found in uploaded file. Are you sure the XML is in OPML format?";

        if (imported > 0)
            message += $"Imported {imported} blogs.\n";

        if (renamed > 0)
            message += $"Renamed {renamed} blogs.\n";

        if (duplicates > 0)
            message += $"Found {duplicates} duplicates.\n";

        return message;
    }
}
