using Microsoft.AspNetCore.Mvc;
using MiniApkSonja.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SQLite;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MiniApkSonja.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private StudentsDb db = new StudentsDb();
        // GET: api/<StudentsController>
        [HttpGet]
        public List<Student> Get()
        {
            return db.getAllStudents();
        }

        // GET api/<StudentsController>/5
        [HttpGet("{id}")]
        public Student Get(int id)
        {
            return db.getStudentById(id);
        }

        // POST api/<StudentsController>
        [HttpPost]
        public void Post([FromBody] Student student)
        {
            db.addStudent(student);
        }

        // PUT api/<StudentsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] Student student)
        {
            //Console.WriteLine(student);
            db.updateStudentInfo(student);
        }

        // DELETE api/<StudentsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            db.deleteStudentById(id);
        }
    }
}
