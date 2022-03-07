using api.Models.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Services;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _auth;
        public AuthController(IConfiguration configuration)
        {
            _auth=new AuthService(configuration);
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterRequest user)
        {
            
            return Ok(_auth.Register(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(AuthRequest user)
        {
            
            return Ok(_auth.Login(user));
        }


    }
}
