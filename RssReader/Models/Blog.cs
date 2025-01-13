using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RssReader.Models;

[Table("blogs")]
public class Blog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string XmlUrl { get; set; }

    public string? Hash { get; set; }

    public string? Etag { get; set; }

    public DateTime LastModified { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = [];
}
