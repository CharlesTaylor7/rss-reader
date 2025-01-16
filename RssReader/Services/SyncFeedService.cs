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
                        await Save(post);
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
            await Save(post);

        await _dbContext.SaveChangesAsync();
    }

    public async Task SyncAllFeeds()
    {
        await foreach (var blog in _dbContext.Blogs)
        {
            await SyncFeed(blog.Id);
        }
    }

    /// <summary>
    /// tries to save post, logs errors instead of crashing
    /// </summary>
    private async Task Save(Post post)
    {
        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            _dbContext.Posts.Remove(post);
        }
    }
}
