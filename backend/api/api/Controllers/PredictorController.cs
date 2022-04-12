using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Net.Http.Headers;
using System.Diagnostics;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PredictorController : Controller
    {
        private readonly IPredictorService _predictorService;
        private IJwtToken jwtToken;
        private readonly IMlConnectionService _mlConnectionService;

        public PredictorController(IPredictorService predictorService, IConfiguration configuration, IJwtToken Token, IMlConnectionService mlConnectionService)
        {
            _predictorService = predictorService;
            jwtToken = Token;
            _mlConnectionService = mlConnectionService;
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

        // GET: api/<PredictorController>/mypredictors
        [HttpGet("mypredictors")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Predictor>> Get()
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            return _predictorService.GetMyPredictors(username);
        }

        // GET: api/<PredictorController>/publicpredictors
        [HttpGet("publicpredictors")]
        public ActionResult<List<Predictor>> GetPublicPredictors()
        {
            return _predictorService.GetPublicPredictors();
        }

        //SEARCH za predictore (public ili private sa ovim imenom )
        // GET api/<PredictorController>/search/{name}
        [HttpGet("search/{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Predictor>> Search(string name)
        {
            string username = getUsername();
            
            if (username == null)
                return BadRequest();

            return _predictorService.SearchPredictors(name, username);
        }

        // GET api/<PredictorController>/getpredictor/{name}
        [HttpGet("getpredictor/{id}")]
        [Authorize(Roles = "User,Guest")]
        public ActionResult<Predictor> GetPredictor(string id)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            Predictor predictor = _predictorService.GetPredictor(username, id);

            if (predictor == null)
                return NotFound($"Predictor with id = {id} not found");

            return predictor;
        }

        // GET api/<PredictorController>/{name}
        [HttpGet("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult<Predictor> Get(string name)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            var predictor = _predictorService.GetOnePredictor(username, name);

            if (predictor == null)
                return NotFound($"Predictor with name = {name} not found or predictor is not public");

            return predictor;
        }
        // moze da vraca sve modele pa da se ovde odradi orderByDesc
        //odraditi to i u Datasetove i Predictore
        // GET: api/<PredictorController>/datesort/{ascdsc}/{latest}
        //asc - rastuce 1
        //desc - opadajuce 0
        //ako se posalje 0 kao latest onda ce da izlista sve u nekom poretku
        [HttpGet("datesort/{ascdsc}/{latest}")]
        [Authorize(Roles = "User")]
        public ActionResult<List<Predictor>> SortPredictors(bool ascdsc, int latest)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            List<Predictor> lista = _predictorService.SortPredictors(username, ascdsc, latest);

            if(latest == 0)
                return lista;
            else
            {
                List<Predictor> novaLista = new List<Predictor>();

                for (int i = 0; i < latest; i++)
                    novaLista.Add(lista[i]);

                return novaLista;
            }
        }

        // POST api/<PredictorController>/add
        [HttpPost("add")]
        [Authorize(Roles = "User")]
        public ActionResult<Predictor> Post([FromBody] Predictor predictor)
        {
            var existingPredictor = _predictorService.GetOnePredictor(predictor.username, predictor.name);

            if (existingPredictor != null)
                return NotFound($"Predictor with name = {predictor.name} exisits");
            else
            {
                _predictorService.Create(predictor);

                return CreatedAtAction(nameof(Get), new { id = predictor._id }, predictor);
            }
        }

        // POST api/<PredictorController>/usepredictor {predictor,inputs}
        [HttpPost("usepredictor/{id}")]
        [Authorize(Roles = "User,Guest")]
        public ActionResult UsePredictor(String id, [FromBody] PredictorColumns[] inputs)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            Predictor predictor = _predictorService.GetPredictor(username, id);
            
            foreach(PredictorColumns i in inputs)
                Debug.WriteLine(i.value.ToString()); 
            return NoContent();
        }

        // PUT api/<PredictorController>/{name}
        [HttpPut("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Put(string name, [FromBody] Predictor predictor)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            var existingPredictor = _predictorService.GetOnePredictor(username, name);

            //ne mora da se proverava
            if (existingPredictor == null)
                return NotFound($"Predictor with name = {name} or user with username = {username} not found");

            _predictorService.Update(username, name, predictor);

            return Ok($"Predictor with name = {name} updated");
        }

        // DELETE api/<PredictorController>/name
        [HttpDelete("{name}")]
        [Authorize(Roles = "User")]
        public ActionResult Delete(string name)
        {
            string username = getUsername();

            if (username == null)
                return BadRequest();

            var predictor = _predictorService.GetOnePredictor(username, name);

            if (predictor == null)
                return NotFound($"Predictor with name = {name} or user with username = {username} not found");

            _predictorService.Delete(predictor.username, predictor.name);

            return Ok($"Predictor with name = {name} deleted");

        }
    }
}
