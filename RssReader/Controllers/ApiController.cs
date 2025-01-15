using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RssReader.Models;

[ApiController]
[Route("api/[controller]")]
public class ApiController : ControllerBase
{
    private readonly RssReaderDbContext _dbContext;

    public ApiController(RssReaderDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("blogs")]
    public async Task<ActionResult<IEnumerable<Blog>>> GetBlogs()
    {
        return await _dbContext.Blogs.ToListAsync();
    }

    [HttpGet("blogs/{id}")]
    public async Task<ActionResult<Blog>> GetBlog(int id)
    {
        return await _dbContext.Blogs.Where(blog => blog.Id == id).FirstAsync();
    }

    [HttpPost("blogs")]
    public async Task<ActionResult<Post>> CreateBlog(Blog blog)
    {
        _dbContext.Blogs.Add(blog);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
    }

    [HttpPut("blogs")]
    public async Task<IActionResult> UpdateBlog(Blog blog)
    {
        _dbContext.Entry(blog).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("blogs/{id}")]
    public async Task<IActionResult> DeleteBlog(int id)
    {
        var blog = await _dbContext.Blogs.FindAsync(id);
        if (blog is null)
            return NotFound();

        _dbContext.Blogs.Remove(blog);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("posts")]
    public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
    {
        return await _dbContext.Posts.ToListAsync();
    }
}
