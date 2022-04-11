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
            return _dataset.Find(dataset => dataset.name == name && dataset.isPublic == true && dataset.isPreProcess).ToList();
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
            return _dataset.Find(dataset => dataset.username == username && dataset.isPreProcess).ToList();
        }
        public List<Dataset> GetGuestDatasets()
        {
            //Join Igranonica public datasetove sa svim temp uploadanim datasetovima
            List<Dataset> datasets= _dataset.Find(dataset => dataset.username == "Igrannonica" && dataset.isPublic == true && dataset.isPreProcess).ToList();
            datasets.AddRange(_dataset.Find(dataset => dataset.username == "" && dataset.isPreProcess).ToList());
            return datasets;
        }

        //poslednji datasetovi
        public List<Dataset> SortDatasets(string username, bool ascdsc, int latest)
        {
            List<Dataset> list = _dataset.Find(dataset => dataset.username == username && dataset.isPreProcess).ToList();

            if(ascdsc)
                list = list.OrderBy(dataset => dataset.lastUpdated).ToList();
            else
                list = list.OrderByDescending(dataset => dataset.lastUpdated).ToList();

            return list;
        }

        public List<Dataset> GetPublicDatasets()
        {
            return _dataset.Find(dataset => dataset.isPublic == true && dataset.isPreProcess).ToList();
        }

        public Dataset GetOneDataset(string username, string name)
        {
            return _dataset.Find(dataset => dataset.username == username && dataset.name == name && dataset.isPreProcess).FirstOrDefault();
        }
        //odraditi za pretragu getOne

        public Dataset GetOneDataset(string id)
        {
            return _dataset.Find(dataset => dataset._id == id && dataset.isPreProcess).FirstOrDefault();
        }

        //ako je potrebno da se zameni name  ili ekstenzija
        public void Update(string username, string name, Dataset dataset )
        {
            _dataset.ReplaceOne(dataset => dataset.username == username && dataset.name == name, dataset);
        }
        public void Update(Dataset dataset)
        {
            _dataset.ReplaceOne(x=>x._id==dataset._id, dataset);
        }

        public string GetDatasetId(string fileId)
        {
            Dataset dataset = _dataset.Find(dataset => dataset.fileId == fileId && dataset.username == "Igrannonica").FirstOrDefault();

            return dataset._id;
        }
        /*
public bool CheckDb()
{
   Dataset? dataset = null;
   dataset = _dataset.Find(dataset => dataset.username == "igrannonica").FirstOrDefault();

   if (dataset != null)
       return false;
   else
       return true;
}*/
    }
}
