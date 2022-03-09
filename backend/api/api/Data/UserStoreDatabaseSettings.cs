using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using api.Interfaces;

namespace api.Data
{
    public class UserStoreDatabaseSettings : IUserStoreDatabaseSettings
    {
        public string ConnectionString { get; set; } = String.Empty;
        public string DatabaseName { get; set; } = String.Empty;
        public string CollectionName { get; set; } = String.Empty;
    }
}
