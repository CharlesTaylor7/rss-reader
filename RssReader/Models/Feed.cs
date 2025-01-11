using System;
using System.Collections.Generic;

namespace RssReader.Models;

public partial class Feed
{
    public int BlogId { get; set; }

    public required string Hash { get; init; }

    public string? Etag { get; set; }

    public required string LastModified { get; init; }

    public virtual required Blog Blog { get; init; }
}
