namespace RssReader.Models;

public class Post
{
    public int Id { get; set; }

    public int BlogId { get; set; }

    public required string Title { get; set; }

    public required string Url { get; set; }

    public DateOnly? PublishedAt { get; set; }

    public bool? Favorite { get; set; }

    public bool? Read { get; set; }

    public virtual required Blog Blog { get; set; }
}
