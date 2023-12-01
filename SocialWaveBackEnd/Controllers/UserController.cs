using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace SocialWaveBackEnd.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    public UserController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        RoleManager<IdentityRole> roleManager, IAuthService authService)
    {
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.authService = authService;
        this.roleManager = roleManager;
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


    [HttpPost("Login")]
    public async Task<ActionResult<string>> Login([FromBody] UserInfo userInfo)
    {
        var retToken = await authService.Login(userInfo);

        if (retToken.Status == EReturnStatus.Success)
            return Ok(retToken.Result);
        else
            return BadRequest(retToken.Result);
    }

    [HttpGet("Details")]
    public async Task<ActionResult<UserInfo>> GetUserDetails()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                return Ok(user);
            }
        }

        return NotFound();
    }


    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly SignInManager<IdentityUser> signInManager;
    private readonly IAuthService authService;
}