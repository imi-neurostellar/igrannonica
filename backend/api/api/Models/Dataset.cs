using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models
{
	public class Dataset
	{
        public string username { get; set; }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]//mongo data type to .net
        public string _id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string[] header { get; set; }
        public string fileId { get; set; }
        public string extension { get; set; }
        public bool isPublic { get; set; }
        public bool accessibleByLink { get; set; }
        public string dateCreated { get; set; }
        public string lastUpdated { get; set; }
    }
}

