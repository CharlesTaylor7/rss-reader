using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RssReader.Models;

[Table("users")]
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string HashedPassword { get; set; }
}
