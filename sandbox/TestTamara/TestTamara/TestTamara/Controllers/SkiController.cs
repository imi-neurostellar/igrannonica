using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestTamara.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkiController : ControllerBase
    {
        // GET: api/<SkiController>
        [HttpGet]
        public string Get()
        {
            return "IZABERITE DESTINACIJU" ;
        }

        // GET api/<SkiController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<SkiController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SkiController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<SkiController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
