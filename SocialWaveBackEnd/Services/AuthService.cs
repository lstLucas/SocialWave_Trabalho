using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService : IAuthService
{
    public AuthService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        this.configuration = configuration;
    }

    public async Task<IAuthService.IReturn<string>> Register(UserInfo model, string role)
    {
        var userExists = await userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
            return new Return<string>(EReturnStatus.Error, "O usuário já existe.");

        IdentityUser user = new()
        {
            UserName = model.Username,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString()
        };
        var createUserResult = await userManager.CreateAsync(user, model.Password);
        
        if (!createUserResult.Succeeded)
            return new Return<string>(EReturnStatus.Error, "Erro na criação do usuário. Verifique os dados e tente novamente.");

        await AddToRole(user, role);

        return new Return<string>(EReturnStatus.Success, "Usuário criado com sucesso.");
    }

    private async Task AddToRole(IdentityUser user, string role)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));

        if (await roleManager.RoleExistsAsync(role))
            await userManager.AddToRoleAsync(user, role);
    }

    public async Task<IAuthService.IReturn<string>> Login(UserInfo model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return new Return<string>(EReturnStatus.Error, 
                "Nome do usuário inválido.");
        if (!await userManager.CheckPasswordAsync(user, model.Password))
            return new Return<string>(EReturnStatus.Error, 
                "Senha inválida.");
        
        string token = GenerateToken(await GetClaims(user));
        return new Return<string>(EReturnStatus.Success, token);
    }

    private async Task<IEnumerable<Claim>> GetClaims(IdentityUser user)
    {
        var userRoles = await userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
            {
               new(ClaimTypes.Name, user.UserName ?? ""),
               new("roles", string.Join(';', userRoles)),
               new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        foreach (var userRole in userRoles)
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));

        return authClaims;
    }

    private string GenerateToken(IEnumerable<Claim> claims)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(GetTokenDescriptor(claims));
        return tokenHandler.WriteToken(token);
    }

    private SecurityTokenDescriptor GetTokenDescriptor(IEnumerable<Claim> claims)
    {
        var authSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["JWT:Secret"] ?? "")
        );
        return new SecurityTokenDescriptor
        {
            Issuer = configuration["JWT:ValidIssuer"],
            Audience = configuration["JWT:ValidAudience"],
            Expires = DateTime.UtcNow.AddMinutes(60),
            SigningCredentials = new SigningCredentials(authSigningKey, 
                                            SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(claims)
        };
    }

    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly IConfiguration configuration;

    public class Return<T> : IAuthService.IReturn<T>
    {
        public Return(EReturnStatus status, T result)
        {
            Status = status;
            Result = result;
        }

        public EReturnStatus Status { get; private set; }
        public T Result { get; private set; } 
    }
}
