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

        //id korisnika
        // GET: api/<ModelController>/{id}/datasets
        [HttpGet("{id}/models")]
        public ActionResult<List<Model>> Get(string id)
        {
            return _modelService.GetAllModels(id);
        }

        //id korisnika, name modela
        // GET api/<ModelController>/{id}/{name}
        [HttpGet("{id}/{name}")]
        public ActionResult<Model> Get(string id, string name)
        {
            var model = _modelService.GetOneModel(id, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with id = {id} not found");

            return model;
        }

        // POST api/<ModelController>/post
        [HttpPost("post")]
        public ActionResult<Model> Post([FromBody] Model model)
        {
            var existingModel = _modelService.GetOneModel(model.uploaderId, model.name);

            if (existingModel != null)
                return NotFound($"Model with name = {model.name} exisits");
            else
            {
                _modelService.Create(model);

                return CreatedAtAction(nameof(Get), new { id = model._id }, model);
            }
        }

        // PUT api/<ModelController>/{id}/{name}
        [HttpPut("{id}/{name}")]
        public ActionResult Put(string id, string name, [FromBody] Model model)
        {
            var existingModel = _modelService.GetOneModel(id, name);

            //ne mora da se proverava
            if (existingModel == null)
                return NotFound($"Model with name = {name} or user with id = {id} not found");

            _modelService.Update(id, name, model);
            return NoContent();
        }

        // DELETE api/<ModelController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id, string name)
        {
            var model = _modelService.GetOneModel(id, name);

            if (model == null)
                return NotFound($"Model with name = {name} or user with id = {id} not found");

            _modelService.Delete(model.uploaderId, model.name);

            return Ok($"Model with name = {name} deleted");

        }

    }
}
