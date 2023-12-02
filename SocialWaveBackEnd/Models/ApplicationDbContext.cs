using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using SocialWaveBackEnd.Models;

namespace SocialWaveApi.Models
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<Post> Feed { get; set; } = null!;
        public DbSet<UserLikedPost> UserLikedPosts { get; set; }
        
        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            options.UseSqlite($"Data Source={System.IO.Path.Join(path, "socialwave.db")}");
        }
    }
}