using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private string[] permittedExtensions = { ".csv" };
        private readonly IConfiguration _configuration;
        public FileUploadController(IConfiguration configuration)
        {
            _configuration = configuration;

        }


        [HttpPost("Csv")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<string>> CsvUpload([FromForm]IFormFile file)
        {

            //get username from jwtToken
            string username;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {

                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:JwtToken").Value);
                try
                {
                    tokenHandler.ValidateToken(parameter, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    }, out SecurityToken validatedToken);

                    var jwtToken = (JwtSecurityToken)validatedToken;
                    username = jwtToken.Claims.First(x => x.Type == "name").Value;
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }else 
                return BadRequest();
            

            //Check filetype
            var filename=file.FileName;
            var ext=Path.GetExtension(filename).ToLowerInvariant();
            var name = Path.GetFileNameWithoutExtension(filename).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || ! permittedExtensions.Contains(ext)) {
                return BadRequest("Wrong file type");
            }
            var folderPath=Path.Combine(Directory.GetCurrentDirectory(),"UploadedFiles",username);
            //Check Directory
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            //Index file if same filename
            var fullPath = Path.Combine(folderPath, filename);
            int i=0;

            while (System.IO.File.Exists(fullPath)) {
                i++;
                fullPath = Path.Combine(folderPath,name+i.ToString()+ext);
            }


            //Write file
            using (var stream=new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok();
        }
    }
}

