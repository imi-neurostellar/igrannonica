using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Net.Http.Headers;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModelController : ControllerBase
    {

        private IMlConnectionService _mlService;
        private readonly IModelService _modelService;
        private JwtToken jwtToken;


        public ModelController(IMlConnectionService mlService, IModelService modelService, IConfiguration configuration)
        {
            _mlService = mlService;
            _modelService = modelService;
            jwtToken = new JwtToken(configuration);
        }

        [HttpPost("sendModel")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<string>> Test([FromBody] object model)
        {
            var result = await _mlService.SendModelAsync(model);
            return Ok(result);
        }

        // GET: api/<ModelController>/mymodels
        [HttpGet("/mymodels")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Model>> Get()
        {
            string username;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                username = jwtToken.TokenToUsername(parameter);
                if (username == null)
                    return null;
            }
            else
                return BadRequest();

            return _modelService.GetMyModels(username);
        }

        // name modela
        // GET api/<ModelController>/{name}
        [HttpGet("/{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<Model> Get(string name)
        {
            string username;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                username = jwtToken.TokenToUsername(parameter);
                if (username == null)
                    return null;
            }
            else
                return BadRequest();

            var model = _modelService.GetOneModel(username, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            return model;
        }

        // POST api/<ModelController>/add
        [HttpPost("add")]
        [Authorize(Roles = "User")]
        public ActionResult<Model> Post([FromBody] Model model)
        {
            if (_modelService.CheckHyperparameters(model.inputNeurons, model.hiddenLayerNeurons, model.hiddenLayers, model.outputNeurons) == false)
                return BadRequest("Bad parameters!");
            var existingModel = _modelService.GetOneModel(model.username, model.name);

            if (existingModel != null)
                return NotFound($"Model with name = {model.name} exisits");
            else
            {
                _modelService.Create(model);

                return CreatedAtAction(nameof(Get), new { id = model._id }, model);
            }
        }

        // PUT api/<ModelController>/{username}/{name}
        [HttpPut("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Put(string name, [FromBody] Model model)
        {
            string username;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                username = jwtToken.TokenToUsername(parameter);
                if (username == null)
                    return null;
            }
            else
                return BadRequest();


            var existingModel = _modelService.GetOneModel(username, name);

            if (existingModel == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            _modelService.Update(username, name, model);
            return NoContent();
        }

        // DELETE api/<ModelController>/username
        [HttpDelete("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Delete(string name)
        {
            string username;
            var header = Request.Headers[HeaderNames.Authorization];
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;
                username = jwtToken.TokenToUsername(parameter);
                if (username == null)
                    return null;
            }
            else
                return BadRequest();

            var model = _modelService.GetOneModel(username, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            _modelService.Delete(model.username, model.name);

            return Ok($"Model with name = {name} deleted");

        }

    }
}
