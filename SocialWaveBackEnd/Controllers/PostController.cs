#nullable disable
using SocialWaveApi.Models;
using SocialWaveBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using SocialWaveApi.Services;

namespace SocialWaveBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    public PostController(ApplicationDbContext db, UserLikedPostService userLikedPostService)
    {
        this.db = db;
        this.userLikedPostService = userLikedPostService;
    }

    // GET: api/Feed
    [HttpGet]
    public ActionResult<IEnumerable<Post>> Get()
    {
        if (db.Feed == null)
            return NotFound("No posts have been made yet.");

        return db.Feed;
    }

    // GET: api/Feed/5
    [HttpGet("{id}")]
    public ActionResult<Post> GetId(string id)
    {
        var obj = db.Feed.FirstOrDefault(x => x.Id == id);

        if (obj == null)
            return NotFound("No post was found with the given identifier.");

        return obj;
    }

    // POST: api/Feed
    [HttpPost]
    public ActionResult<Post> Post(Post post)
    {
        if (string.IsNullOrWhiteSpace(post.Id))
            post.Id = Guid.NewGuid().ToString();

        var authorId = post.AuthorId;

        var author = db.Users.FirstOrDefault(u => u.Id == authorId);

        if (author != null)
        {
            post.AuthorId = authorId;
            post.AuthorName = author.UserName;
        }
        else
        {
            return BadRequest("Author not found");
        }

        db.Feed.Add(post);
        db.SaveChanges();

        return CreatedAtAction(
            nameof(GetId),
            new { id = post.Id },
            post
        );
    }

    // PUT: api/Feed/5
    [HttpPut("{id}")]
    public IActionResult Put(string id, Post obj)
    {
        if (id != obj.Id)
            return BadRequest("The identifier provided differs from the post identifier");

        db.Feed.Update(obj);
        db.SaveChanges();

        return NoContent();
    }

    // PUT: api/Feed/like/5/2
    [HttpPut("like/{id}/{userId}")]
    public async Task<IActionResult> ToggleLike(string id, string userId)
    {
        var post = await db.Feed.FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
        {
            return NotFound("Post not found");
        }

        userLikedPostService.ToggleLike(userId, id);

        try
        {
            db.Update(post);
            await db.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PostExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

    }

    // GET: api/Feed/like/2
    [HttpGet("like/{userId}")]
    public IActionResult GetLikedPosts(string userId)
    {
        var likedPostIds = db.UserLikedPosts
                            .Where(ul => ul.UserId == userId)
                            .Select(ul => ul.PostId)
                            .ToList();

        var likedPosts = db.Feed
                            .Where(p => likedPostIds.Contains(p.Id))
                            .ToList();

        if (likedPosts == null || likedPosts.Count == 0)
        {
            return NotFound("No liked posts found for the user");
        }

        return Ok(likedPosts);
    }


    // DELETE: api/Feed/5
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        if (db.Feed == null)
            return NotFound("No posts have been made yet.");

        var obj = db.Feed.FirstOrDefault(x => x.Id == id);

        if (obj == null)
            return NotFound("No post was found with the given identifier.");

        db.Feed.Remove(obj);
        db.SaveChanges();

        return NoContent();
    }

    private bool PostExists(string id)
    {
        return db.Feed.Any(e => e.Id == id);
    }

    private readonly ApplicationDbContext db;
    private readonly UserLikedPostService userLikedPostService;
}
