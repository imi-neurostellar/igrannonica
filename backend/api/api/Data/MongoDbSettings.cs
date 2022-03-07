using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace api.Data
{
    public class MongoDbSettings
    {
        public string? ConnectionURI { get; set; } = null;
        public string? DatabaseName { get; set; } = null;
        public string? CollectionName { get; set; } = null;





    }
}
