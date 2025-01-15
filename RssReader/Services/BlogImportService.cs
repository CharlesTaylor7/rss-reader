using System.Xml;
using EFCore.BulkExtensions;
using RssReader.Models;

public interface IBlogImportService
{
    Task<ImportResult> ImportBlogsAsync(IFormFile file);
}

public record class ImportResult(int Imported, int Renamed, int Duplicates);

public class BlogImportService : IBlogImportService
{
    private readonly RssReaderDbContext _dbContext;
    private readonly ILogger<BlogImportService> _logger;

    public BlogImportService(RssReaderDbContext context, ILogger<BlogImportService> logger)
    {
        _dbContext = context;
        _logger = logger;
    }

    public async Task<ImportResult> ImportBlogsAsync(IFormFile file)
    {
        var blogs = new List<Blog>();
        var renames = 0;
        var duplicates = 0;

        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        using var stream = file.OpenReadStream();
        using var reader = XmlReader.Create(stream, new XmlReaderSettings { Async = true });

        while (await reader.ReadAsync())
        {
            if (reader.NodeType != XmlNodeType.Element || reader.Name != "outline")
                continue;

            reader.MoveToAttribute("title");
            var title = reader.Value;

            reader.MoveToAttribute("xmlUrl");
            var xmlUrl = reader.Value;
            var blog = _dbContext.Blogs.FirstOrDefault(blog => blog.XmlUrl == xmlUrl);

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

        await _dbContext.SaveChangesAsync();
        await _dbContext.BulkInsertAsync(blogs);
        await transaction.CommitAsync();

        return new(Imported: blogs.Count, Renamed: renames, Duplicates: duplicates);
    }
}
