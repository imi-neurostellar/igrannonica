using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private string[] permittedExtensions = { ".csv" };


        [HttpPost("Csv")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<string>> CsvUpload([FromForm]IFormFile file,[FromForm]string username)//???Umesto username poslati jwt odakle se moze preuzeti username radi sigurnosti
        {
            var filename=file.FileName;
            var ext=Path.GetExtension(filename).ToLowerInvariant();
            var name = Path.GetFileNameWithoutExtension(filename).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || ! permittedExtensions.Contains(ext)) {
                return BadRequest("Wrong file type");
            }
            var folderPath=Path.Combine(Directory.GetCurrentDirectory(),"UploadedFiles",username);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fullPath = Path.Combine(folderPath, filename);
            int i=0;

            while (System.IO.File.Exists(fullPath)) {
                i++;
                fullPath = Path.Combine(folderPath,name+i.ToString()+ext);
            }


            
            using (var stream=new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok();
        }
    }
}
