using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return colors.ToArray();
        }

        private static List<string> colors = new List<string>(new string[] { "#ff0000", "#00ff00", "#0000ff" });

        // POST api/<ValuesController>
        [HttpPost]
        public string Post([FromBody] RGB color)
        {
            string hex = string.Format("#{0:X2}{1:X2}{2:X2}", color.red, color.green, color.blue);
            colors.Add(hex);
            return hex;
        }
    }

    public class RGB
    {
        public int red { get; set; }
        public int green { get; set; }
        public int blue { get; set; }
    }
}


