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
        [BsonElement("name")]
        public string name { get; set; }

        public string description { get; set; }
        //datetime
        public string dateCreated { get; set; }
        
        public int[] inputColumns { get; set; }
        public int columnToPredict { get; set; }
        public bool randomTestSet { get; set; }
        public int randomTestSetDistribution { get; set; }


        public string type { get; set; }
        public string encoding { get; set; }
        public string optimizer { get; set; }
        public string lossFunction { get; set; }
        public int inputNeurons { get; set; }
        public int hiddenLayerNeurons { get; set; }
        public int hiddenLayers { get; set; }
        public int batchSize { get; set; }
        public string inputLayerActivationFunction { get; set; }
        public string hiddenLayerActivationFunction { get; set; }
        public string outputLayerActivationFunction { get; set; }


        [BsonElement("extension")]
        public string extension { get; set; }
        

    }
}
