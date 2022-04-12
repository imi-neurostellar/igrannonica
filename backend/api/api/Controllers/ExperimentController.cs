using System.Net.Http.Headers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperimentController : ControllerBase
    {

        private readonly IExperimentService _experimentService;
        private IJwtToken jwtToken;
        private readonly IMlConnectionService _mlConnectionService;
        private readonly IFileService _fileService;

        public ExperimentController(IExperimentService experimentService, IConfiguration configuration, IJwtToken Token, IMlConnectionService mlConnectionService, IFileService fileService)
        {
            _experimentService = experimentService;
            jwtToken = Token;
            _mlConnectionService = mlConnectionService;
            _fileService = fileService;
        }

        [HttpPost("add")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult<Experiment>> Post([FromBody] Experiment experiment)
        {
            string uploaderId;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                uploaderId = jwtToken.TokenToId(parameter);
                if (uploaderId == null)
                    return BadRequest();
            }
            else
                return BadRequest();

            experiment.uploaderId = uploaderId;
            var existingExperiment = _experimentService.Get(uploaderId, experiment.name);
            if(existingExperiment != null)
                return NotFound($"Experiment with name = {experiment.name} exisits");
            _experimentService.Create(experiment);
            return Ok(experiment);
        }

        [HttpGet("get")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult<Experiment>> Get(string id)
        {
            string uploaderId;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                uploaderId = jwtToken.TokenToId(parameter);
                if (uploaderId == null)
                    return null;
            }
            else
                return BadRequest();

            var experiment = _experimentService.Get(id);
            if(experiment.uploaderId!=uploaderId)
                return BadRequest("Not your experiment");

            return Ok(experiment);
        }

        [HttpGet("getMyExperiments")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult<List<Experiment>>> getMyExperiments()
        {
            string uploaderId;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                uploaderId = jwtToken.TokenToId(parameter);
                if (uploaderId == null)
                    return null;
            }
            else
                return BadRequest();
            var experiments=_experimentService.GetMyExperiments(uploaderId);
            return Ok(experiments);

        }



    }
}
