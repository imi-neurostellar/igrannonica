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
		public DateTime dateCreated { get; set; }
		public string experimentId { get; set; }

	}
}

/*
{
	"_id" : "",
		"username" : "ivan123",
	  "name" : "Neki prediktor",
		"description" : "Neki opis prediktora koji je unet tamo",
		"inputs": ["proba",
		  "proba2", 
		  "proba3"
		],
		"output" : "izlaz",
		"isPublic" : true,
		"accessibleByLink" : true,
		"dateCreated" : "2022-04-11T20:33:26.937+00:00",
    "experimentId" : "Neki id eksperimenta"
}
*/