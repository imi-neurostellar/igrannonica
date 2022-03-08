using api.Models.Users;

namespace api.Services
{
    public interface IAuthService
    {
        string Login(AuthRequest user);
        string Register(RegisterRequest user);
    }
}