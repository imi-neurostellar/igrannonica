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

        public List<Predictor> SearchPredictors(string name, string username)
        {
            return _predictor.Find(predictor => predictor.name == name && predictor.isPublic == true).ToList();
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
        public Predictor GetPredictor(string username, string id)
        {
            return _predictor.Find(predictor => predictor._id == id && (predictor.username == username || predictor.isPublic == true)).FirstOrDefault();

        }
        //last private models
        public List<Predictor> SortPredictors(string username, bool ascdsc, int latest)
        {
            List<Predictor> list = _predictor.Find(predictor => predictor.username == username).ToList();


            if (ascdsc)
                list = list.OrderBy(predictor => predictor.dateCreated).ToList();
            else
                list = list.OrderByDescending(predictor => predictor.dateCreated).ToList();
            return list;
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
