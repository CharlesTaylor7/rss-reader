using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace RssReader.Models;

[Table("posts")]
public class Post
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int BlogId { get; set; }

    public string Title { get; set; }

    public string Url { get; set; }

    public DateTime PublishedAt { get; set; }

    public bool Favorite { get; set; }

    public bool Read { get; set; }

    public override string ToString() => JsonSerializer.Serialize(this);
}
