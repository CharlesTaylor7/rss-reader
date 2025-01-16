using System;
using System.Net.Http;
using System.Xml;
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

        using var response = await _httpClient.GetAsync(
            blog.XmlUrl,
            HttpCompletionOption.ResponseHeadersRead
        );

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError($"Request failed with status code: {response.StatusCode}");
            return;
        }

        foreach (var header in response.Headers)
        {
            _logger.LogCritical($"{header.Key}: {string.Join(", ", header.Value)}");
        }

        using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = XmlReader.Create(
            stream,
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
                        Upsert(post);
                    post = new Post { BlogId = blog.Id };
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
            Upsert(post);

        await _dbContext.SaveChangesAsync();
    }

    public async Task SyncAllFeeds()
    {
        foreach (var blog in await _dbContext.Blogs.ToListAsync())
            try
            {
                await SyncFeed(blog);
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
            }
    }

    /// <summary>
    /// tries to upsert post, logs errors instead of crashing
    /// </summary>
    private void Upsert(Post post)
    {
        if (post.Url == null)
        {
            _logger.LogError($"No url for post: {post}");
            return;
        }
        _dbContext.Database.ExecuteSqlRaw(
            @"
            INSERT INTO posts(blogId, url, title, publishedAt) values ({0}, {1}, {2}, {3})
            ON CONFLICT (url) DO UPDATE
            SET 
                title = excluded.title,
                publishedAt = excluded.publishedAt
            ;

        ",
            post.BlogId,
            post.Url,
            post.Title,
            post.PublishedAt
        );
    }
}
