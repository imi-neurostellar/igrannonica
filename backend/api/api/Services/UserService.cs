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
        public void Update(string username, User user)
        {
            _users.ReplaceOne(user => user.Username == username, user);
        }
        public void Delete(string username)
        {
            _users.DeleteOne(user => user.Username == username);

        }
    }
}
