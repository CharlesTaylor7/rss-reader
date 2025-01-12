using System.ComponentModel.DataAnnotations;

namespace RssReader.Models;

public class Post
{
    public int Id { get; set; }

    [Required]
    public int BlogId { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Url { get; set; }

    [Required]
    public DateTime PublishedAt { get; set; }

    public bool Favorite { get; set; }

    public bool Read { get; set; }

    [Required]
    public virtual Blog Blog { get; set; }
}
