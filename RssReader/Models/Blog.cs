using System;
using System.Collections.Generic;

namespace RssReader.Models;

public partial class Blog
{
    public int Id { get; set; }

    public required string Title { get; init; }

    public required string XmlUrl { get; init; }

    public virtual Feed? Feed { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
