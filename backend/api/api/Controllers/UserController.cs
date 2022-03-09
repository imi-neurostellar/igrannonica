using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//dovrsi kontroler
namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        // GET: api/<UserController>
        [HttpGet]
        public ActionResult<List<User>> Get()
        {
            return userService.Get();
        }

        // GET api/<UserController>/5
        //potrebno za profile page
        [HttpGet("{id}")]
        public ActionResult<User> Get(string id)
        {
            var user = userService.Get(id);
            
            if (user == null)
                return NotFound($"User with Id = {id} not found");
            
            return user;
        }

        // POST api/<UserController>
        [HttpPost]
        public ActionResult<User> Post([FromBody] User user)
        {
            userService.Create(user);

            //Debug.WriteLine("\nTest.\n");

            return CreatedAtAction(nameof(Get), new { id = user._id }, user);

        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] User user)
        {
            var existingUser = userService.Get(id);

            if(existingUser == null)
                return NotFound($"User with Id = {id} not found");

            userService.Update(id, existingUser);
            return NoContent();
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var user = userService.Get(id);

            if (user == null)
                return NotFound($"User with Id = {id} not found");

            userService.Delete(user._id);
            return Ok($"Student with Id = {id} deleted");
        }
    }
}
/*
{
    "userId": {
        "$oid": "62276146c4a20eabc664abc3"
    },
  "username" : "ivan996sk",
  "email" : "ivan996sk@gmail.com",
  "password" : "proba",
  "firstName" : "Ivan",
  "lastName" : "Ljubisavljevic"
}
*/