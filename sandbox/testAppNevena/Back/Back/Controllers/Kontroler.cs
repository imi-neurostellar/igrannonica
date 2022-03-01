using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Kontroler : ControllerBase
    {
        // GET: api/<ValuesController>
        /*[HttpGet]
        public string Get()
        {
            return "";
        }*/

        // POST api/<ValuesController>
        // string
        [HttpPost]
        public int Post([FromBody] Numbers num)
        {
            //return (num.a + num.b).ToString();
            //Debug.WriteLine(num.a);
            //return "syfugds";
            return num.a + num.b;
        }
    }

    public class Numbers
    {
        public int a { get; set; }
        public int b { get; set; }

    }
}
