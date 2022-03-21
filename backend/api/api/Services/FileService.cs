using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class FileService : IFileService
    {

        private readonly IMongoCollection<FileModel> _file;

        public FileService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _file = database.GetCollection<FileModel>(settings.FilesCollectionName);
        }

        public FileModel Create(FileModel file)
        {
            if (file == null)
                return null;
            _file.InsertOne(file);
            return file;

        }
        public string GetFilePath(string id, string username)
        {
            FileModel file = _file.Find(x => x._id == id && x.username == username).FirstOrDefault();
            if (file == null)
                return null;
            return file.path;
        }
        
    }
}
