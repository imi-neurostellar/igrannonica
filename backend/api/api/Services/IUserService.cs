using api.Models;

namespace api.Services
{
    public interface IUserService
    {
        List<User> Get();// daje sve korisnike
        User Get(string id); //daje korisnika po id-u
        User Create(User user); // kreira korisnika
        void Update(string id, User user); //apdejruje korisnika po idu
        void Delete(string id);//brise korisnika
    }
}
