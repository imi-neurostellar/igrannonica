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

        public List<Dataset> SearchDatasets(string name, string username)
        {
            return _dataset.Find(dataset => dataset.name == name && dataset.isPublic == true).ToList();
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

        public List<Dataset> GetMyDatasets(string username)
        {
            return _dataset.Find(dataset => dataset.username == username).ToList();
        }
        public List<Dataset> GetGuestDatasets()
        {
            //Join Igranonica public datasetove sa svim temp uploadanim datasetovima
            List<Dataset> datasets= _dataset.Find(dataset => dataset.username == "Igrannonica" && dataset.isPublic == true).ToList();
            datasets.AddRange(_dataset.Find(dataset => dataset.username == "").ToList());
            return datasets;
        }

        //poslednji datasetovi
        public List<Dataset> SortDatasets(string username, bool ascdsc, int latest)
        {
            List<Dataset> list = _dataset.Find(dataset => dataset.username == username).ToList();

            if(ascdsc)
                list = list.OrderBy(dataset => dataset.lastUpdated).ToList();
            else
                list = list.OrderByDescending(dataset => dataset.lastUpdated).ToList();

            return list;
        }

        public List<Dataset> GetPublicDatasets()
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
