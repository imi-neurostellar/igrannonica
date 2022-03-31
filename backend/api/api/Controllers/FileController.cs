using System.Net.Http.Headers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private string[] permittedExtensions = { ".csv" };
        private readonly IConfiguration _configuration;
        private IJwtToken _token;
        private IFileService _fileservice;
        public FileController(IConfiguration configuration,IFileService fileService,IJwtToken token)
        {
            _configuration = configuration;
            _token = token;
            _fileservice = fileService;

        }


        [HttpPost("Csv")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult<string>> CsvUpload([FromForm]IFormFile file)
        {

            //get username from jwtToken
            string uploaderId;
            string folderName;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {

                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                uploaderId = _token.TokenToId(parameter);
                if (uploaderId == null)
                    return null;
            }else 
                return BadRequest();
            if (uploaderId == "")
            {
                folderName = "TempFiles";
            }
            else
            {
                folderName = "UploadedFiles";
            }
            

            //Check filetype
            var filename=file.FileName;
            var ext=Path.GetExtension(filename).ToLowerInvariant();
            var name = Path.GetFileNameWithoutExtension(filename).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || ! permittedExtensions.Contains(ext)) {
                return BadRequest("Wrong file type");
            }
            var folderPath=Path.Combine(Directory.GetCurrentDirectory(),folderName, uploaderId);
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
            FileModel fileModel= new FileModel();
            fileModel.path=fullPath;
            fileModel.uploaderId= uploaderId;
            fileModel.date = DateTime.Now.ToUniversalTime();
            fileModel =_fileservice.Create(fileModel);
            

            return Ok(fileModel);
        }

        [HttpGet("Download")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult> DownloadFile(string id)
        {
            //Get Username
            string uploaderId;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {

                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                uploaderId = _token.TokenToId(parameter);
                if (uploaderId == null)
                    return null;
            }
            else
                return BadRequest();

            string filePath = _fileservice.GetFilePath(id, uploaderId);
            if (filePath == null)
                return BadRequest();

            return File(System.IO.File.ReadAllBytes(filePath),"application/octet-stream", Path.GetFileName(filePath));

        }

    }
}
