using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace api.Models
{
    public class Model
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]//mongo data type to .net
        public string _id { get; set; }
        public string username { get; set; }


        public string name { get; set; }
        public string description { get; set; }
        //datetime
        public string dateCreated { get; set; }
        public string lastUpdated { get; set; }
        //proveriti id
        public string datasetId { get; set; }

        //Test set settings
        public string[] inputColumns { get; set; }
        public string columnToPredict { get; set; }
        public bool randomOrder {get;set;}
        public bool randomTestSet { get; set; }
        public float randomTestSetDistribution { get; set; }

        //Neural net training
        public string type { get; set; }
        public string encoding { get; set; }
        public string optimizer { get; set; }
        public string lossFunction { get; set; }
        public int inputNeurons { get; set; }
        public int hiddenLayerNeurons { get; set; }
        public int hiddenLayers { get; set; }
        public int batchSize { get; set; }
        // na izlazu je moguce da bude vise neurona (klasifikacioni problem sa vise od 2 klase)
        public int outputNeurons { get; set; }
        public string inputLayerActivationFunction { get; set; }
        public string hiddenLayerActivationFunction { get; set; }
        public string outputLayerActivationFunction { get; set; }


    }
}
