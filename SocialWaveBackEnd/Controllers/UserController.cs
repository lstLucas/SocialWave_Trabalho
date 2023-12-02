#nullable disable
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SocialWaveApi.Models;

namespace SocialWaveBackEnd.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    public UserController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager, IAuthService authService,
        ApplicationDbContext db)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.authService = authService;
        this.roleManager = roleManager;
        this.db = db;
    }

    [HttpPost("Create")]
    public async Task<ActionResult<string>> CreateUser([FromBody] UserInfo model)
    {
        return await CreateUserExecute(model);
    }

    [Authorize(Policy = "Admin")]
    [HttpPost("CreateAdmin")]
    public async Task<ActionResult<string>> CreateAdminUser([FromBody] UserInfo model)
    {
        return await CreateUserExecute(model, "Admin");
    }

    private async Task<ActionResult<string>> CreateUserExecute(UserInfo userInfo,
                                                        string roleName = "Member")
    {
        var ret = await authService.Register(userInfo, roleName);

        if (ret.Status == EReturnStatus.Success)
        {
            var retToken = await authService.Login(userInfo);

            if (retToken.Status == EReturnStatus.Success)
                return Ok(retToken.Result);
            else
                return BadRequest(retToken.Result);
        }
        else
            return BadRequest(ret.Result);
    }

    [Authorize(Policy = "Admin")]
    [HttpGet("All")]
    public ActionResult<IEnumerable<UserInfo>> GetAllUsers()
    {
        var users = userManager.Users.ToList();

        if (users.Any())
        {
            var userInfoList = users.Select(user => new UserInfo
            {
                Id = Guid.Parse(user.Id),
                Username = user.UserName,
                Email = user.Email,
            }).ToList();

            return Ok(userInfoList);
        }

        return NotFound("No user found.");
    }

    [Authorize(Policy = "Admin")]
    [HttpGet("AllMembers")]
    public async Task<ActionResult<IEnumerable<UserInfo>>> GetAllMembers()
    {
        var adminUsers = await userManager.GetUsersInRoleAsync("Admin");
        var allUsers = userManager.Users.ToList();

        var nonAdminUsers = allUsers.Where(user => !adminUsers.Any(admin => admin.Id == user.Id));

        if (nonAdminUsers.Any())
        {
            var userInfoList = nonAdminUsers.Select(user => new UserInfo
            {
                Id = Guid.Parse(user.Id),
                Username = user.UserName,
                Email = user.Email,
            }).ToList();

            return Ok(userInfoList);
        }

        return new List<UserInfo>();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserInfo>> GetUserById(string id)
    {
        if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out _))
        {
            return BadRequest("Invalid ID");
        }

        var user = await userManager.FindByIdAsync(id);

        if (user != null)
        {
            var userInfo = new UserInfo
            {
                Id = Guid.Parse(user.Id),
                Username = user.UserName,
                Email = user.Email,
            };

            return Ok(userInfo);
        }

        return NotFound("User not found.");
    }

    [Authorize(Policy = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUserById(string id)
    {
        if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out _))
        {
            return BadRequest("Invalid ID");
        }

        var user = await userManager.FindByIdAsync(id);

        if (user != null)
        {
            var posts = db.Feed.Where(p => p.AuthorId == id).ToList();
            Console.WriteLine(posts);

            if (posts != null)
            {
                db.Feed.RemoveRange(posts);
                db.SaveChanges();
            }
            var result = await userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok("User deleted successfully.");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete user.");
            }
        }

        return NotFound("User not found.");
    }



    [HttpPost("Login")]
    public async Task<ActionResult<string>> Login([FromBody] UserInfo userInfo)
    {
        var retToken = await authService.Login(userInfo);

        if (retToken.Status == EReturnStatus.Success)
            return Ok(retToken.Result);
        else
            return BadRequest(retToken.Result);
    }

    [HttpGet("Details/{email}")]
    public async Task<ActionResult<UserInfo>> GetUserDetailsByEmail(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("O e-mail não pode ser nulo ou vazio.");
        }

        var user = await userManager.FindByEmailAsync(email);

        if (user != null)
        {
            return Ok(user);
        }

        return NotFound("Usuário não encontrado para o e-mail fornecido.");
    }



    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly SignInManager<IdentityUser> signInManager;
    private readonly IAuthService authService;
    private readonly ApplicationDbContext db;

}