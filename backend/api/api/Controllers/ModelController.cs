using api.Models;
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
        private readonly IModelService _modelService;
        

        public ModelController(IMlConnectionService mlService, IModelService modelService)
        {
            _mlService = mlService;
            _modelService = modelService;
        }

        [HttpPost("sendModel")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<string>> Test([FromBody] object model)
        {
            var result = await _mlService.SendModelAsync(model);
            return Ok(result);
        }

        // GET: api/<ModelController>/{username}/models
        [HttpGet("{username}/models")]
        public ActionResult<List<Model>> Get(string username)
        {
            return _modelService.GetAllModels(username);
        }

        //id korisnika, name modela
        // GET api/<ModelController>/{username}/{name}
        [HttpGet("{username}/{name}")]
        public ActionResult<Model> Get(string username, string name)
        {
            var model = _modelService.GetOneModel(username, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            return model;
        }

        // POST api/<ModelController>/post
        [HttpPost("post")]
        public ActionResult<Model> Post([FromBody] Model model)
        {
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
        [HttpPut("{username}/{name}")]
        public ActionResult Put(string username, string name, [FromBody] Model model)
        {
            var existingModel = _modelService.GetOneModel(username, name);

            //ne mora da se proverava
            if (existingModel == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            _modelService.Update(username, name, model);
            return NoContent();
        }

        // DELETE api/<ModelController>/username
        [HttpDelete("{username}")]
        public ActionResult Delete(string username, string name)
        {
            var model = _modelService.GetOneModel(username, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with username = {username} not found");

            _modelService.Delete(model.username, model.name);

            return Ok($"Model with name = {name} deleted");

        }

    }
}
