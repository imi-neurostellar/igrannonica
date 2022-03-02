using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SIBack.Interfaces;
using SIBack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SIBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LaptopController : ControllerBase
    {
        //dependencie injections
        private ILaptopData _laptopData;

        public LaptopController(ILaptopData laptopData)
        {
            _laptopData = laptopData;
        }

        [HttpGet]
        [Route("/api/sviLaptopovi")]
        public IActionResult GetLaptops()
        {
            return Ok(_laptopData.GetLaptops());
        }

        [HttpGet]
        [Route("/api/laptop/{id}")]
        public IActionResult GetLaptop(Guid id)
        {
            return Ok(_laptopData.GetLaptop(id));
        }

        [HttpDelete]
        [Route("/api/brisanje/{id}")]
        public IActionResult DeleteLaptop(Guid id)
        {
            var l = _laptopData.GetLaptop(id);

            if (l != null)
            { 
                _laptopData.DeleteLaptop(l);
                return Ok(true);//200
            }

            return NotFound(false);//404
        }



        [HttpPut]
        [Route("/api/update")]
        public IActionResult EditLaptop(Laptop l)
        {
            var laptop = _laptopData.GetLaptop(l.id);

            if (laptop != null)
            {
                _laptopData.EditLaptop(l);
                return Ok(true);//200
            }

            return NotFound(false);//404
        }

        [HttpPost]
        [Route("/api/add")]
        public IActionResult DodajLaptop(Laptop l)
        {
            var laptop = _laptopData.AddLaptop(l);

             return Ok(laptop);//200
            
        }

    }
}
