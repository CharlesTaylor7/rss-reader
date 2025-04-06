from django.db import models


class Blog(models.Model):
    """RSS/Atom blog feed."""

    title = models.CharField(max_length=255)
    xml_url = models.URLField(unique=True)

    class Meta:
        db_table = "blogs"


class Post(models.Model):
    """Blog post from a feed."""

    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    url = models.URLField(unique=True)
    published_at = models.DateTimeField(
        null=True
    )  # Changed from INTEGER to DateTimeField
    favorite = models.BooleanField(default=False)
    read = models.BooleanField(default=False)

    class Meta:
        db_table = "posts"


class Feed(models.Model):
    """Feed metadata for caching and conditional HTTP requests."""

    blog = models.OneToOneField(Blog, on_delete=models.CASCADE, primary_key=True)
    hash = models.CharField(max_length=64)  # For content hash
    etag = models.CharField(max_length=64, null=True)  # HTTP ETag header
    last_modified = models.CharField(max_length=64)  # HTTP Last-Modified header

    class Meta:
        db_table = "feeds"
