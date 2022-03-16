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


        // GET: api/<DatasetController>/{username}/datasets
        [HttpGet("{username}/datasets")]
        public ActionResult<List<Dataset>> Get(string username)
        {
            return _datasetService.GetAllDatesets(username);
        }

        // GET api/<DatasetController>/{username}/{name}
        [HttpGet("{username}/{name}")]
        public ActionResult<Dataset> Get(string username, string name)
        {
            var dataset = _datasetService.GetOneDataset(username, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            return dataset;
        }

        // POST api/<DatasetController>/add
        [HttpPost("add")]
        public ActionResult<Dataset> Post([FromBody] Dataset dataset)
        {
            var existingDataset = _datasetService.GetOneDataset(dataset.username, dataset.name);

            if (existingDataset != null)
                return NotFound($"Dateset with name = {dataset.name} exisits");
            else
            {
                _datasetService.Create(dataset);

                return CreatedAtAction(nameof(Get), new { id = dataset._id }, dataset);
            }
        }

        // PUT api/<DatasetController>/{username}/{name}
        [HttpPut("{username}/{name}")]
        public ActionResult Put(string username, string name, [FromBody] Dataset dataset)
        {
            var existingDataset = _datasetService.GetOneDataset(username, name);

            //ne mora da se proverava
            if (existingDataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            _datasetService.Update(username, name, dataset);
            return NoContent();
        }

        // DELETE api/<DatasetController>/username/name
        [HttpDelete("{username}/{name}")]
        public ActionResult Delete(string username, string name)
        {
            var dataset = _datasetService.GetOneDataset(username, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            _datasetService.Delete(dataset.username, dataset.name);

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