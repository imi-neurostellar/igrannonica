using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public interface IUserService
    {
        List<User> Get();// daje sve korisnike
        User GetUserUsername(string username); //daje korisnika po korisnickom imenu
        User Create(User user); // kreira korisnika
        void Update(string username, User user); //apdejtuje korisnika po idu
        void Delete(string username);//brise korisnika
    }
}
