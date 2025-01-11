using System;
using System.Collections.Generic;

namespace RssReader;

public partial class Blog
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string XmlUrl { get; set; } = null!;

    public virtual Feed? Feed { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}
