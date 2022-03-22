using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class TempRemovalService
    {
        private readonly IMongoCollection<FileModel> _file;
        private readonly IMongoCollection<Model> _model;
        private readonly IMongoCollection<Dataset> _dataset;

        public TempRemovalService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _file = database.GetCollection<FileModel>(settings.FilesCollectionName);
            _model= database.GetCollection<Model>(settings.ModelCollectionName);
            _dataset = database.GetCollection<Dataset>(settings.DatasetCollectionName);
        }
        public void DeleteTemps()
        {
            List<FileModel> files = _file.Find(file => file.username == "").ToList();
            foreach (var file in files)
            {
                if ((DateTime.Now.ToUniversalTime() - file.date).TotalDays >= 1)
                {
                    DeleteFile(file._id);
                    List<Dataset> datasets = _dataset.Find(dataset => dataset.fileId == file._id && dataset.username=="").ToList();
                    foreach(var dataset in datasets)
                    {
                        DeleteDataset(dataset._id);
                        List<Model> models = _model.Find(model => model.datasetId == dataset._id && model.username=="").ToList();
                        foreach(var model in models)
                        {
                            DeleteModel(model._id);
                        }
                    }
                    if (File.Exists(file.path))
                        File.Delete(file.path);
                }
            }
            //Brisanje modela ukoliko gost koristi vec postojeci dataset
            List<Model> models1= _model.Find(model =>model.username == "").ToList();
            foreach(var model in models1)
            {
                if ((DateTime.Now.ToUniversalTime() - model.dateCreated.ToUniversalTime()).TotalDays >= 1)
                {
                    DeleteModel(model._id);
                }
            }
            

        }




        public void DeleteFile(string id)
        {
            _file.DeleteOne(file => file._id == id);
        }
        public void DeleteModel(string id)
        {
            _model.DeleteOne(model=>model._id==id);
        }
        public void DeleteDataset(string id)
        {
            _dataset.DeleteOne(dataset => dataset._id == id);
        }


    }
}
