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
		public string uploaderId { get; set; }
		//public string name { get; set; }
		//public string description { get; set; }
		public string[] inputs { get; set; }
		public string output { get; set; }
		public bool isPublic { get; set; }
		public bool accessibleByLink { get; set; }
		public DateTime dateCreated { get; set; }
		public string experimentId { get; set; }
		public string modelId { get; set; }
		public string h5FileId { get; set; }
		public Metric[] metrics { get; set; }
		public Metric[] finalMetrics { get; set; }
	}

	public class Metric
    {
		string Name { get; set; }
		string JsonValue { get; set; }

    }

}

/** 
* Paste one or more documents here

{
	"_id": {
		"$oid": "625dc348b7856ace8a6f8702"

	},
		"uploaderId" : "6242ea59486c664208d4255c",
		"inputs": ["proba",
		  "proba2", 
		  "proba3"
		],
		"output" : "izlaz",
		"isPublic" : true,
		"accessibleByLink" : true,
		"dateCreated" : "2022-04-11T20:33:26.937+00:00",
    "experimentId" : "Neki id eksperimenta",
    "modelId" : "Neki id eksperimenta",
    "h5FileId" : "Neki id eksperimenta",
    "metrics" : [{ }]
}*/