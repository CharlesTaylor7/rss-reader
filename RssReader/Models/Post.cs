using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RssReader.Models;

[Table("posts")]
public class Post
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int BlogId { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    [Index()]
    public string Url { get; set; }

    [Required]
    public DateTime PublishedAt { get; set; }

    public bool Favorite { get; set; }

    public bool Read { get; set; }

    [ForeignKey("BlogId")]
    public virtual Blog Blog { get; set; }
}
