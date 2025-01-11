using System;
using System.Collections.Generic;

namespace RssReader.Models;

public partial class Post
{
    public int Id { get; set; }

    public int BlogId { get; set; }

    public string Title { get; set; } = null!;

    public string Url { get; set; } = null!;

    public DateOnly? PublishedAt { get; set; }

    public bool? Favorite { get; set; }

    public bool? Read { get; set; }

    public virtual Blog Blog { get; set; } = null!;
}
