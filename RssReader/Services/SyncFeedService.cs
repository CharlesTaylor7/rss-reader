using System.Xml;
using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;

namespace RssReader.Services;

public interface ISyncFeedService
{
    Task SyncFeed(int id);
    public Task SyncFeed(Blog blog);
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

    public async Task SyncFeed(int id)
    {
        var blog = await _dbContext.Blogs.FirstOrDefaultAsync(blog => blog.Id == id);
        if (blog is null)
            throw new Exception("Blog doesn't exist");

        await SyncFeed(blog);
    }

    public async Task SyncFeed(Blog blog)
    {
        _logger.LogInformation($"Syncing: {blog.XmlUrl}");
        var body = await _httpClient.GetStreamAsync(blog.XmlUrl);
        using var reader = XmlReader.Create(
            body,
            new XmlReaderSettings { Async = true, DtdProcessing = DtdProcessing.Ignore }
        );

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
                        await Upsert(post);
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
            await Upsert(post);

        await _dbContext.SaveChangesAsync();
    }

    public async Task SyncAllFeeds()
    {
        await Task.WhenAll(_dbContext.Blogs.Select(blog => SyncFeed(blog.Id)));
    }

    /// <summary>
    /// tries to upsert post, logs errors instead of crashing
    /// </summary>
    private async Task Upsert(Post post)
    {
        var existing = await _dbContext.Posts.FirstOrDefaultAsync(p => p.Url == post.Url);
        if (existing is not null)
            post.Id = existing.Id;

        _dbContext.Posts.Add(post);
        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError(e.ToString());
            _dbContext.Posts.Remove(post);
        }
    }
}
