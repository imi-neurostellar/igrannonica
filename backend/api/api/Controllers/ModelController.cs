using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelController : ControllerBase
    {

        private IMlConnectionService _mlService;

        public ModelController(IMlConnectionService mlService)
        {
            _mlService = mlService;
        }

        [HttpPost("sendModel")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<string>> Test([FromBody] object model)
        {
            var result = await _mlService.SendModelAsync(model);
            return Ok(result);
        }

    }
}
