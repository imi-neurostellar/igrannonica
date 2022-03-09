using api.Interfaces;
using api.Models;
using api.Models.Users;
using MongoDB.Driver;

namespace api.Services
{
    public class AuthService : IAuthService
    {
        private JwtToken _jwt;
        private readonly IConfiguration _configuration;
        private readonly IMongoCollection<User> _users;
        public AuthService(IConfiguration configuration, IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            _configuration = configuration;
            _jwt = new JwtToken(_configuration);
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _users = database.GetCollection<User>(settings.CollectionName);
        }
        public string Login(AuthRequest user)
        {
            User u = _users.Find(x => x.Username == user.UserName).FirstOrDefault();
            if (u == null)
                return "Username doesn't exist";
            if (!PasswordCrypt.checkPassword(user.Password, u.Password))
                return "Wrong password";
            return _jwt.GenToken(user);

        }
        public string Register(RegisterRequest user)
        {
            User u = new User();
            u.Username = user.username;
            u.Email = user.email;
            u.Password = PasswordCrypt.hashPassword(user.password);
            u.FirstName = user.firstName;
            u.LastName = user.lastName;
            if (_users.Find(user => user.Username == u.Username).FirstOrDefault() != null)
                return "Username Already Exists";
            if (_users.Find(user => user.Email == u.Email).FirstOrDefault() != null)
                return "Email Already Exists";

            _users.InsertOne(u);
            return "User added";
        }


    }
}
