namespace RssReader.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; }
    public string HashedPassword { get; set; }

    public virtual ICollection<Blog> Blogs { get; set; } = [];
    public virtual ICollection<Post> Posts { get; set; } = [];
}
