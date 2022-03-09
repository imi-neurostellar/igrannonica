using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class DatasetService : IDatasetService
    {
        private readonly IMongoCollection<Dataset> _dataset;

        public DatasetService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _dataset = database.GetCollection<Dataset>(settings.DatasetCollectionName);
        }
        //kreiranje dataseta
        public Dataset Create(Dataset dataset)
        {
            _dataset.InsertOne(dataset);
            return dataset;
        }

        //brisanje odredjenog name-a
        public void Delete(string uploaderId, string name)
        {
            _dataset.DeleteOne(dataset => dataset.UploaderId == uploaderId && dataset.name == name); ;
        }

        public Dataset Get(string uploaderId)
        {
            return _dataset.Find(dataset => dataset.UploaderId == uploaderId).FirstOrDefault();
        }

        //ako je potrebno da se zameni name  ili ekstenzija
        public void Update(string uploaderId, Dataset dataset)
        {
            _dataset.ReplaceOne(dataset => dataset.UploaderId == uploaderId, dataset);
        }
    }
}
