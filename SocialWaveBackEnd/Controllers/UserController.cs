using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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

    [HttpPost("Login")]
    public async Task<ActionResult<string>> Login([FromBody] UserInfo userInfo)
    {
        var retToken = await authService.Login(userInfo);

        if (retToken.Status == EReturnStatus.Success)
            return Ok(retToken.Result);
        else
            return BadRequest(retToken.Result);
    }
    
    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly SignInManager<IdentityUser> signInManager;
    private readonly IAuthService authService;
}