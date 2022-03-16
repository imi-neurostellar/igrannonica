using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class PredictorService : IPredictorService
    {
        private readonly IMongoCollection<Predictor> _predictor;

        public PredictorService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _predictor = database.GetCollection<Predictor>(settings.PredictorCollectionName);
        }

        public Predictor Create(Predictor predictor)
        {
            _predictor.InsertOne(predictor);
            return predictor;
        }

        public void Delete(string username, string name)
        {
            _predictor.DeleteOne(predictor => (predictor.username == username && predictor.name == name));
        }

        public List<Predictor> GetMyPredictors(string username)
        {
            return _predictor.Find(predictor => predictor.username == username).ToList();
        }

        public Predictor GetOnePredictor(string username, string name)
        {
            return _predictor.Find(predictor => predictor.username == username && predictor.name == name).FirstOrDefault();

        }

        public List<Predictor> GetPublicPredictors()
        {
            return _predictor.Find(predictor => predictor.isPublic == true).ToList();
        }

        public void Update(string username, string name, Predictor predictor)
        {
            _predictor.ReplaceOne(predictor => predictor.username == username && predictor.name == name, predictor);

        }
    }
}
