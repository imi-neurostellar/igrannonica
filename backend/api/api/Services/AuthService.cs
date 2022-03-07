using api.Models;
using api.Models.Users;

namespace api.Services
{
    public class AuthService
    {
        private JwtToken _jwt;
        private readonly IConfiguration _configuration;
        public AuthService(IConfiguration configuration)
        {
            _configuration = configuration;
            _jwt = new JwtToken(_configuration);
        }
        public string Login(AuthRequest user)
        {
            //Check username in DB

            //Verify password

            //gen token

            return _jwt.GenToken(user);

        }
        public RegisterRequest Register(RegisterRequest user)
        {
            //check for existing email and username
            user.password = PasswordCrypt.hashPassword(user.password);
            //Add to DB. TO DO
            return user;
        }


    }
}
