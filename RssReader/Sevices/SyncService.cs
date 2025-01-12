namespace RssReader.Services;

public interface ISyncFeedService
{
    Task SyncFeed(int BlogId);
    Task SyncAllFeeds();
}

public class SyncFeedService : ISyncFeedService
{
    public SyncFeedService(ILogger logger, Se
    public async Task SyncFeed(int BlogId)
    {

        //
    }

    public async Task SyncAllFeeds()
    {
        //
    }
}
