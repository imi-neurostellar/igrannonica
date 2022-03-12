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
            _dataset.DeleteOne(dataset => (dataset.UploaderId == uploaderId && dataset.name == name)); 
        }
        public List<Dataset> GetAllDatesets(string uploaderId)
        {
            return _dataset.Find(dataset => dataset.uploaderId == uploaderId).ToList();
        }
        public Dataset GetOneDataset(string uploaderId, string name)
        {
            return _dataset.Find(dataset => dataset.UploaderId == uploaderId && dataset.name == name).FirstOrDefault();
        }

        //ako je potrebno da se zameni name  ili ekstenzija
        public void Update(string uploaderId, string name, Dataset dataset)
        {
            _dataset.ReplaceOne(dataset => dataset.UploaderId == uploaderId && dataset.name == name, dataset);
        }
    }
}
