using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models
{
    public class Dataset
    {
        internal string uploaderId;

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]//mongo data type to .net
        public string _id { get; set; }
        [BsonElement("uploaderId")]
        public string UploaderId { get; set; }
        [BsonElement("extension")]
        public string extension { get; set; }
        [BsonElement("name")]
        public string name { get; set; }

    }
}
