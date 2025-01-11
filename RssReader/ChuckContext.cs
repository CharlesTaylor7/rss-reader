using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RssReader;

public partial class ChuckContext : DbContext
{
    public ChuckContext() { }

    public ChuckContext(DbContextOptions<ChuckContext> options)
        : base(options) { }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Feed> Feeds { get; set; }

    public virtual DbSet<Migration> Migrations { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        =>
        optionsBuilder.UseSqlite("DataSource=../data/chuck.db");

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

        modelBuilder.Entity<Migration>(entity =>
        {
            entity.ToTable("migrations");

            entity.Property(e => e.Id).ValueGeneratedNever().HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
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
