using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RssReader.Models;

public partial class RssReaderContext : DbContext
{
    public RssReaderContext() { }

    public RssReaderContext(DbContextOptions<RssReaderContext> options)
        : base(options) { }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Feed> Feeds { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlite("DataSource=../data/rss-reader.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(entity =>
        {
            entity.ToTable("blogs");

            entity.HasIndex(e => e.XmlUrl, "IX_blogs_xml_url").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.XmlUrl).HasColumnName("xml_url");
        });

        modelBuilder.Entity<Feed>(entity =>
        {
            entity.HasKey(e => e.BlogId);

            entity.ToTable("feeds");

            entity.Property(e => e.BlogId).ValueGeneratedNever().HasColumnName("blog_id");
            entity.Property(e => e.Etag).HasColumnName("etag");
            entity.Property(e => e.Hash).HasColumnName("hash");
            entity.Property(e => e.LastModified).HasColumnName("last_modified");

            entity
                .HasOne(d => d.Blog)
                .WithOne(p => p.Feed)
                .HasForeignKey<Feed>(d => d.BlogId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.ToTable("posts");

            entity.HasIndex(e => e.Url, "IX_posts_url").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BlogId).HasColumnName("blog_id");
            entity.Property(e => e.Favorite).HasColumnType("BOOL").HasColumnName("favorite");
            entity.Property(e => e.PublishedAt).HasColumnName("published_at");
            entity.Property(e => e.Read).HasColumnType("BOOL").HasColumnName("read");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Url).HasColumnName("url");

            entity
                .HasOne(d => d.Blog)
                .WithMany(p => p.Posts)
                .HasForeignKey(d => d.BlogId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
