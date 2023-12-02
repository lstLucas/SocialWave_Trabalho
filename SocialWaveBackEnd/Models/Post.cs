namespace SocialWaveBackEnd.Models;

public class Post 
{
    public string? Id { get; set; }
    public string Title { get; set; } = "";
    public string Body { get; set; } = "";
    public int Likes {get; set; }
    public string? AuthorId { get; set; }
    public string? AuthorName { get; set; }

}