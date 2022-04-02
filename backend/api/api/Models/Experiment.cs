using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models
{
    public class Experiment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        public string datasetId { get; set; }
        public string[] inputColumns { get; set; }
        public string outputColumn { get; set; }
        public bool randomOrder { get; set; }
        public bool randomTestSet { get; set; }
        public float randomTestSetDistribution { get; set; }
        public string nullValues { get; set; }
        public NullValues[] nullValuesReplacers { get; set; }

    }
}
