using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models
{
	public class Predictor
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]//mongo data type to .net
		public string _id { get; set; }
		public string username { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string[] inputs { get; set; }
		public string output { get; set; }
		public bool isPublic { get; set; }
		public bool accessibleByLink { get; set; }
		public string dateCreated { get; set; }
	}
}

