﻿using api.Models;
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
        private readonly IMlConnectionService _mlConnectionService;
        private readonly IFileService _fileService;
        private IJwtToken jwtToken;

        public DatasetController(IDatasetService datasetService, IConfiguration configuration,IJwtToken Token,IMlConnectionService mlConnectionService, IFileService fileService)
        {
            _datasetService = datasetService;
            _mlConnectionService = mlConnectionService;
            _fileService = fileService;
            jwtToken = Token;
        }
        public string getUsername()
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
                return null;

            return username;
        }

        // GET: api/<DatasetController>/mydatasets
        [HttpGet("mydatasets")]
        [Authorize(Roles = "User,Guest")]
        public ActionResult<List<Dataset>> Get()
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            if (username == "")
                return _datasetService.GetGuestDatasets();

            //ako bude trebao ID, samo iz baze uzeti

            return _datasetService.GetMyDatasets(username);
        }

        // GET: api/<DatasetController>/datesort/{ascdsc}/{latest}
        //asc - rastuce 1
        //desc - opadajuce 0
        //ako se posalje 0 kao latest onda ce da izlista sve u nekom poretku
        [HttpGet("datesort/{ascdsc}/{latest}")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Dataset>> SortDatasets(bool ascdsc, int latest)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            List<Dataset> lista = _datasetService.SortDatasets(username, ascdsc, latest);

            if (latest == 0)
                return lista;
            else
            {
                List<Dataset> novaLista = new List<Dataset>();
                for (int i = 0; i < latest; i++)
                    novaLista.Add(lista[i]);
                return novaLista;
            }
        }

        // GET: api/<DatasetController>/publicdatasets
        [HttpGet("publicdatasets")]
        public ActionResult<List<Dataset>> GetPublicDS()
        {
            return _datasetService.GetPublicDatasets();
        }

        //SEARCH za datasets (public ili private sa ovim imenom )
        // GET api/<DatasetController>/search/{name}
        [HttpGet("search/{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Dataset>> Search(string name)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            //ako bude trebao ID, samo iz baze uzeti

            return _datasetService.SearchDatasets(name, username);
        }


        // GET api/<DatasetController>/{name}
        //get odredjeni dataset
        [HttpGet("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<Dataset> Get(string name)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            var dataset = _datasetService.GetOneDataset(username, name);
            if (dataset == null)
                return NotFound($"Dataset with name = {name} not found or dataset is not public or not preprocessed");

            return dataset;
        }

        // POST api/<DatasetController>/add
        [HttpPost("add")]
        [Authorize(Roles = "User,Guest")]
        public async Task<ActionResult<Dataset>> Post([FromBody] Dataset dataset)
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
            //da li ce preko tokena da se ubaci username ili front salje
            //dataset.username = usernameToken;
            //username = "" ako je GUEST DODAO
            var existingDataset = _datasetService.GetOneDataset(dataset.username, dataset.name);

            if (existingDataset != null)
                return NotFound($"Dateset with name = {dataset.name} exisits");
            else
            {
                FileModel fileModel = _fileService.getFile(dataset.fileId);
                dataset.isPreProcess = false;
                _datasetService.Create(dataset);
                _mlConnectionService.PreProcess(dataset,fileModel.path,uploaderId);
                return Ok();
            }
        }


        // PUT api/<DatasetController>/{name}
        [HttpPut("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Put(string name, [FromBody] Dataset dataset)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            var existingDataset = _datasetService.GetOneDataset(username, name);

            //ne mora da se proverava
            if (existingDataset == null)
                return NotFound($"Dataset with name = {name} or user with username = {username} not found");

            dataset.lastUpdated = DateTime.UtcNow;

            _datasetService.Update(username, name, dataset);

            return Ok($"Dataset with name = {name} updated");
        }

        // DELETE api/<DatasetController>/name
        [HttpDelete("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Delete(string name)
        {
            string username = getUsername();

            if (username == null)
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
    "name": "name",
    "description": "description",
    "header" : ["ag","rt"],
    "fileId" : "652",
    "extension": "csb",
    "isPublic" : true,
    "accessibleByLink": true,
    "dateCreated": "dateCreated",
    "lastUpdated" : "proba12"
}
*/