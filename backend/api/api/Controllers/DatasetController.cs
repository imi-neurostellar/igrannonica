using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Net.Http.Headers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatasetController : ControllerBase
    {
        private readonly IDatasetService _datasetService;
        private JwtToken jwtToken;

        public DatasetController(IDatasetService datasetService, IConfiguration configuration)
        {
            _datasetService = datasetService;
            jwtToken = new JwtToken(configuration);
        }


        // GET: api/<DatasetController>/mydatasets
        [HttpGet("/mydatasets")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Dataset>> Get()
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

            //ako bude trebao ID, samo iz baze uzeti

            return _datasetService.GetMyDatesets(username);
        }

        // GET: api/<DatasetController>/publicdatasets
        [HttpGet("/datasets")]
        public ActionResult<List<Dataset>> GetPublicDS()
        {
            return _datasetService.GetPublicDatesets();
        }

        // GET api/<DatasetController>/{name}
        //get odredjeni dataset
        [HttpGet("/{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<Dataset> Get(string name)
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

            var dataset = _datasetService.GetOneDataset(username, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            return dataset;
        }

        /*za pretragu vratiti dataset koji je public
          public ActionResult<Dataset> Get(string name)
        {
            

            var dataset = _datasetService.GetOneDataset(username, name);

            if (dataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            return dataset;
        }
         */

        // POST api/<DatasetController>/add
        [HttpPost("add")]
        [Authorize(Roles = "User")]
        public ActionResult<Dataset> Post([FromBody] Dataset dataset)
        {
            //da li ce preko tokena da se ubaci username ili front salje
            //dataset.username = usernameToken;
            var existingDataset = _datasetService.GetOneDataset(dataset.username, dataset.name);

            if (existingDataset != null)
                return NotFound($"Dateset with name = {dataset.name} exisits");
            else
            {
                _datasetService.Create(dataset);

                return CreatedAtAction(nameof(Get), new { id = dataset._id }, dataset);
            }
        }

        // PUT api/<DatasetController>/{name}
        [HttpPut("/{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Put(string name, [FromBody] Dataset dataset)
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

            var existingDataset = _datasetService.GetOneDataset(username, name);

            //ne mora da se proverava
            if (existingDataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            _datasetService.Update(username, name, dataset);

            return Ok($"Dataset with name = {name} updated");
        }

        // DELETE api/<DatasetController>/name
        [HttpDelete("/{name}")]
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