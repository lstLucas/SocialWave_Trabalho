namespace SocialWaveBackEnd.Models;

public class UserLikedPost
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public string? PostId { get; set; }
}
