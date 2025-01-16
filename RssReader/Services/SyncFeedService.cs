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
    private readonly RssReaderDbContext _dbContext;
    private readonly HttpClient _httpClient;

    public SyncFeedService(
        ILogger<SyncFeedService> logger,
        RssReaderDbContext dbContext,
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

        Post? post = null;
        while (await reader.ReadAsync())
        {
            if (reader.NodeType != XmlNodeType.Element)
                continue;

            switch (reader.Name)
            {
                case "item":
                case "entry":
                    // save previous entity
                    if (post is not null)
                        _dbContext.Posts.Add(post);
                    post = new Post { Blog = blog };
                    break;

                case "title" when post is not null:
                    post.Title = await reader.ReadElementContentAsStringAsync();
                    break;

                case "link" when post is not null:
                    post.Url = await reader.ReadElementContentAsStringAsync();
                    break;

                case "pubDate" when post is not null:
                case "published" when post is not null:
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
        if (post is not null)
            _dbContext.Posts.Add(post);

        _logger.LogDebug($"Posts: {_dbContext.Posts.Count().ToString()}");
        await _dbContext.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    public async Task SyncAllFeeds()
    {
        await foreach (var blog in _dbContext.Blogs)
        {
            await SyncFeed(blog.Id);
        }
    }
}
