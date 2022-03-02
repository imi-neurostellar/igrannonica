using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;




// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestAppOgnjen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        // GET: api/<ToDoController>
        [HttpGet]
        public string Get()
        {
            var conn = Db.conn;
            conn.Open();
            var command=conn.CreateCommand();
            command.CommandText = @"select * from ToDo";
            var reader=command.ExecuteReader();
            string test = "";
            List<ToDo> lista=new List<ToDo>();
            while (reader.Read())
            {
                ToDo task = new ToDo(int.Parse(reader["id"].ToString()),reader["task"].ToString(), int.Parse(reader["done"].ToString()));
                //test += JsonConvert.SerializeObject(task);
                lista.Add(task);
            }
            conn.Close();
            test = JsonConvert.SerializeObject(lista);
            return test;
            //return JsonConvert.SerializeObject(new ToDo(1, "pera radi", false));

        }
        // POST api/<ToDoController>
        [HttpPost]
        public void Post([FromBody] ToDo task)
        {
            //ToDo task = System.Text.Json.JsonSerializer.Deserialize<ToDo>(value);
            //ToDo task=JsonConvert.DeserializeObject<ToDo>(value);
            var conn = Db.conn;
            conn.Open();
            var command = conn.CreateCommand();
            command.CommandText = @"insert into ToDo(task,done) VALUES(@task,@done)";
            command.Parameters.AddWithValue("@task", task.task);
            command.Parameters.AddWithValue("@done", task.done);
            command.Prepare();
            command.ExecuteNonQuery();
            conn.Close();

        }

        // PUT api/<ToDoController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] ToDo task)
        {
            var conn = Db.conn;
            conn.Open();
            var command = conn.CreateCommand();
            command.CommandText = @"UPDATE ToDo set done=@done where id=@id";
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@done", task.done);
            command.Prepare();
            command.ExecuteNonQuery();
            conn.Close();
        }

        // DELETE api/<ToDoController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var conn = Db.conn;
            conn.Open();
            var command = conn.CreateCommand();
            command.CommandText = @"delete from ToDo where id=@id";
            command.Parameters.AddWithValue("@id", id);
            command.Prepare();
            command.ExecuteNonQuery();
            conn.Close();
        }
    }
}
