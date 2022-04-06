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

        public ExperimentController(IExperimentService experimentService, IConfiguration configuration, IJwtToken Token)
        {
            _experimentService = experimentService;
            jwtToken = Token;
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
                    return null;
            }
            else
                return BadRequest();

            experiment.uploaderId = uploaderId;

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



    }
}
