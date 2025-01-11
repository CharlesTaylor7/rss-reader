namespace RssReader.Models;

public class Blog
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string XmlUrl { get; init; }

    public virtual Feed? Feed { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
