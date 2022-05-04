using api.Models.Users;

namespace api.Models
{
    public interface IJwtToken
    {
        string GenGuestToken();
        string GenToken(AuthRequest user);
        string RenewToken(string existingToken);
        string TokenToUsername(string token);
        public string TokenToId(string token);
    }
}