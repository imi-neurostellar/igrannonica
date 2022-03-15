using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private readonly IDatasetService _datasetService;

        public DatasetController(IDatasetService datasetService)
        {
            _datasetService = datasetService;
        }


        // GET: api/<DatasetController>/{id}/datasets
        [HttpGet("{id}/datasets")]
        public ActionResult<List<Dataset>> Get(string id)
        {
            return _datasetService.GetAllDatesets(id);
        }

        // GET api/<DatasetController>/{id}/{name}
        [HttpGet("{id}/{name}")]
        public ActionResult<Dataset> Get(string id, string name)
        {
            var dataset = _datasetService.GetOneDataset(id, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with id = {id} not found");

            return dataset;
        }

        // POST api/<DatasetController>/post
        [HttpPost("post")]
        public ActionResult<Dataset> Post([FromBody] Dataset dataset)
        {
            var existingUser = _datasetService.GetOneDataset(dataset.uploaderId,dataset.name);

            if (existingUser != null)
                return NotFound($"Dateset with name = {dataset.name} exisits");
            else
            {
                _datasetService.Create(dataset);

                return CreatedAtAction(nameof(Get), new { id = dataset._id }, dataset);
            }
        }

        // PUT api/<DatasetController>/{id}/{name}
        [HttpPut("{id}/{name}")]
        public ActionResult Put(string id, string name, [FromBody] Dataset dataset)
        {
            var existingDataset = _datasetService.GetOneDataset(id, name);

            //ne mora da se proverava
            if (existingDataset == null)
                return NotFound($"Dataset with name = {name} or user with id = {id} not found");

            _datasetService.Update(id, name, dataset);
            return NoContent();
        }

        // DELETE api/<DatasetController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id, string name)
        {
            var dataset = _datasetService.GetOneDataset(id, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with id = {id} not found");

            _datasetService.Delete(dataset.uploaderId,dataset.name);

            return Ok($"Dataset with name = {name} deleted");

        }
    }
}

/*
{
  "_id": "",
  "uploaderId" : "uploaderId",
  "name" : "name",
  "description" : "description",
  "dateCreated" : "dateCreated",
  "inputColumns" : [2,3,4],
  "columnToPredict" : 1,
  "randomTestSet" : true,
  "randomTestSetDistribution" : 1,
  "type" : "type",
  "encoding" : "encoding",
  "optimizer" : "optimizer",
  "lossFunction" : "lossFunction",
  "inputNeurons" : 2,
  "hiddenLayerNeurons" : 3,
  "hiddenLayers" : 8,
  "batchSize" : 6,
  "inputLayerActivationFunction" : "inputLayerActivationFunction",
  "hiddenLayerActivationFunction" : "hiddenLayerActivationFunction",
  "outputLayerActivationFunction" : "outputLayerActivationFunction",
  "extension" : "extension"

}
*/