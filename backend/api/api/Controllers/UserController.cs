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

        // GET api/<UserController>/5
        //potrebno za profile page
        [HttpGet("{id}")]
        public ActionResult<User> GetUserUsername(string username)
        {
            var user = userService.GetUserUsername(username);

            if (user == null)
                return NotFound($"User with Id = {username} not found");

            return user;
        }

        // POST api/<UserController>
        [HttpPost]
        public ActionResult<User> Post([FromBody] User user)
        {
            
            var existingUser = userService.GetUserUsername(user.Username);

            if (existingUser != null)
                return NotFound($"User with username = {user.Username} exisits");
            else
            {
                userService.Create(user);

                //Debug.WriteLine("\nTest.\n");

                return CreatedAtAction(nameof(Get), new { id = user._id }, user);
            }
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] User user)
        {
            var existingUser = userService.Get(id);

            //ne mora da se proverava
            if(existingUser == null)
                return NotFound($"User with Id = {id} not found");

            userService.Update(id, user);
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
  "_id": "",
  "username" : "ivan996sk",
  "email" : "ivan996sk@gmail.com",
  "password" : "proba",
  "firstName" : "Ivan",
  "lastName" : "Ljubisavljevic"
}
*/