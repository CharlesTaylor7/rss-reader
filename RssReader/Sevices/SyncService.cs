using Microsoft.EntityFrameworkCore;
using RssReader.Models;

namespace RssReader.Services;

public interface ISyncFeedService
{
    Task SyncFeed(int BlogId);
    Task SyncAllFeeds();
}

public class SyncFeedService : ISyncFeedService
{
    private readonly ILogger _logger;
    private readonly RssReaderContext _dbContext;
    private readonly HttpClient _httpClient;

    public SyncFeedService(ILogger logger, RssReaderContext dbContext, HttpClient httpClient)
    {
        _logger = logger;
        _dbContext = dbContext;
        _httpClient = httpClient;
    }

    public async Task SyncFeed(int BlogId)
    {

        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        var blog = await _dbContext
            .Blogs.Include(blog => blog.Feed)
            .FirstOrDefaultAsync(blog => blog.Id == BlogId);
        if (blog is null)
            throw new Exception("Blog doesn't exist");

        var feed = blog.Feed ?? new Feed { Blog = blog };
        var body = await _httpClient.GetStreamAsync(blog.XmlUrl);

        using (var reader = XmlReader.Create(stream, new XmlReaderSettings { Async = true }))
    }

    public async Task SyncAllFeeds()
    {
        await foreach (var blog in _dbContext.Blogs)
        {
            await SyncFeed(blog.Id);
        }
    }
}
