namespace RssReader.Models;

public class Feed
{
    public int BlogId { get; init; }

    public required string Hash { get; set; }

    public string? Etag { get; set; }

    public required string LastModified { get; set; }

    public virtual required Blog Blog { get; init; }
}
