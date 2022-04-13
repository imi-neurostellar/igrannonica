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
        public DateTime dateCreated { get; set; }
        public DateTime lastUpdated { get; set; }
        //proveriti id
        //public string experimentId { get; set; }


        //Neural net training
        public string type { get; set; }
        public string optimizer { get; set; }
        public string lossFunction { get; set; }
        //public int inputNeurons { get; set; }
        public int hiddenLayerNeurons { get; set; }
        public int hiddenLayers { get; set; }
        public int batchSize { get; set; }
        // na izlazu je moguce da bude vise neurona (klasifikacioni problem sa vise od 2 klase)
        public int outputNeurons { get; set; }
        public string[] hiddenLayerActivationFunctions { get; set; }
        public string outputLayerActivationFunction { get; set; }

        public string[] metrics { get; set; }
        public int epochs { get; set; }
        //public bool isTrained { get; set; }
        //public NullValues[] nullValues { get; set; }
    }
}
