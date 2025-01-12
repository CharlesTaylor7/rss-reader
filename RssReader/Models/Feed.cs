namespace RssReader.Models;

public class Feed
{
    public int BlogId { get; init; }

    public string? Hash { get; set; }

    public string? Etag { get; set; }

    public DateTime LastModified { get; set; }

    public virtual required Blog Blog { get; init; }
}
