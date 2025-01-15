using Microsoft.EntityFrameworkCore;

namespace RssReader.Models;

public partial class RssReaderDbContext : DbContext
{
    public RssReaderDbContext(DbContextOptions<RssReaderDbContext> options)
        : base(options) { }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlite(
            $"DataSource={Path.Join(Environment.GetEnvironmentVariable("VOLUME"), "rss-reader.db")}"
        );
}
