﻿using Microsoft.EntityFrameworkCore;

namespace RssReader.Models;

public partial class RssReaderContext : DbContext
{
    public RssReaderContext() { }

    public RssReaderContext(DbContextOptions<RssReaderContext> options)
        : base(options) { }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlite($"DataSource=../volume/rss-reader.db");
}
