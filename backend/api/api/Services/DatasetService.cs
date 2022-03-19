using System.Linq;
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
        public void Delete(string username, string name)
        {
            _dataset.DeleteOne(dataset => (dataset.username == username && dataset.name == name)); 
        }

        public List<Dataset> GetMyDatesets(string username)
        {
            return _dataset.Find(dataset => dataset.username == username).ToList();
        }

        public List<Dataset> GetLatestDatasets(string username, int latest)
        {
            List<Dataset> list = _dataset.Find(dataset => dataset.username == username).ToList();


         

            return list;
        }

        public List<Dataset> GetPublicDatesets()
        {
            return _dataset.Find(dataset => dataset.isPublic == true).ToList();
        }

        public Dataset GetOneDataset(string username, string name)
        {
            return _dataset.Find(dataset => dataset.username == username && dataset.name == name).FirstOrDefault();
        }
        //odraditi za pretragu getOne

        //ako je potrebno da se zameni name  ili ekstenzija
        public void Update(string username, string name, Dataset dataset)
        {
            _dataset.ReplaceOne(dataset => dataset.username == username && dataset.name == name, dataset);
        }
    }
}
