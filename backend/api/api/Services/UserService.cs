using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class UserService : IUserService 
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
             _users = database.GetCollection<User>(settings.CollectionName);
        }
        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }

        public List<User> Get()
        {
            return _users.Find(user => true).ToList();
        }

        public User GetUserUsername(string username)
        {
            return _users.Find(user => user.Username == username).FirstOrDefault();
        }

        public User Get(string id)
        {
            return _users.Find(user => user._id == id).FirstOrDefault();
        }

        public void Delete(string id)
        {
            _users.DeleteOne(user => user._id == id);

        }
        public void Update(string id, User user)
        {
            _users.ReplaceOne(user => user._id == id, user);
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

{
    "_id": {
        "$oid": "62291140d88e6bcf95c96a58"
    },
    "uploaderId":"",
    "extension" : "",
    "name" : ""
}

*/
