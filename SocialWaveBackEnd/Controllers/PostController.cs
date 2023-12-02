#nullable disable
using SocialWaveApi.Models;
using SocialWaveBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace SocialWaveBackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    public PostController(ApplicationDbContext db) =>
        this.db = db;

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

        var author = db.UserInfo.Find(authorId);
        System.Console.WriteLine(author);

        if (author != null)
        {
            post.AuthorId = authorId;
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

    private readonly ApplicationDbContext db;
}
