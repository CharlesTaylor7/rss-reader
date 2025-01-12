using System.Xml;
using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;
using RssReader.Models;

namespace RssReader.Services;

public interface ISyncFeedService
{
    Task SyncFeed(int BlogId);
    Task SyncAllFeeds();
}

public class SyncFeedService : ISyncFeedService
{
    private readonly ILogger<SyncFeedService> _logger;
    private readonly RssReaderContext _dbContext;
    private readonly HttpClient _httpClient;

    public SyncFeedService(
        ILogger<SyncFeedService> logger,
        RssReaderContext dbContext,
        HttpClient httpClient
    )
    {
        _logger = logger;
        _dbContext = dbContext;
        _httpClient = httpClient;
    }

    public async Task SyncFeed(int BlogId)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        var blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.Id == BlogId);
        if (blog is null)
            throw new Exception("Blog doesn't exist");

        var body = await _httpClient.GetStreamAsync(blog.XmlUrl);

        using var reader = XmlReader.Create(body, new XmlReaderSettings { Async = true });

        Post post = null!;
        while (await reader.ReadAsync())
        {
            if (reader.NodeType != XmlNodeType.Element)
                continue;

            switch (reader.Name)
            {
                case "item":
                case "entry":
                    post = new Post { User = blog.User, Blog = blog };
                    break;

                case "title":
                    post.Title = await reader.ReadElementContentAsStringAsync();
                    break;

                case "link":
                    post.Url = await reader.ReadElementContentAsStringAsync();
                    break;

                case "pubDate":
                case "published":
                    var dateString = await reader.ReadElementContentAsStringAsync();
                    if (DateTime.TryParse(dateString, out var parsed))
                    {
                        post.PublishedAt = parsed;
                    }
                    else
                    {
                        _logger.LogWarning($"Could not parse publish date: {dateString}");
                    }
                    break;
            }
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task SyncAllFeeds()
    {
        await foreach (var blog in _dbContext.Blogs)
        {
            await SyncFeed(blog.Id);
        }
    }
}
