using System;
using System.Collections.Generic;

namespace RssReader;

public partial class Feed
{
    public int BlogId { get; set; }

    public string Hash { get; set; } = null!;

    public string? Etag { get; set; }

    public string LastModified { get; set; } = null!;

    public virtual Blog Blog { get; set; } = null!;
}
