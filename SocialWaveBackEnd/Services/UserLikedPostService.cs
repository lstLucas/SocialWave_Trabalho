using SocialWaveBackEnd.Models;
using SocialWaveApi.Models;
using Microsoft.EntityFrameworkCore;

namespace SocialWaveApi.Services;
public class UserLikedPostService
{
    
    public UserLikedPostService(ApplicationDbContext db)
    {
        this.db = db;
    }

    public void ToggleLike(string userId, string postId)
    {
        if(!HasUserLikedPost(userId, postId)){
            var userLikedPost = new UserLikedPost
            {
                UserId = userId,
                PostId = postId
            };
            var post = db.Feed.FirstOrDefault(post => post.Id == postId);
            if(post != null){
                post.Likes += 1;
                db.UserLikedPosts.Add(userLikedPost);
            }

        } else {
            var post = db.Feed.FirstOrDefault(post => post.Id == postId);
            var userLikedPost = db.UserLikedPosts.FirstOrDefault(lp => lp.PostId == postId && lp.UserId == userId);
            if(post != null && userLikedPost != null){
                post.Likes -= 1;
                db.UserLikedPosts.Remove(userLikedPost);
            }
        }

        db.SaveChanges();
    }

    public bool HasUserLikedPost(string userId, string postId)
    {
        return db.UserLikedPosts
            .Any(ul => ul.UserId == userId && ul.PostId == postId);
    }

    private readonly ApplicationDbContext db;
}
