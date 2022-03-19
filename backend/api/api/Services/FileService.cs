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
        public void Delete(string id)
        {
            _file.DeleteOne(file => file._id == id);

        }
        public void DeleteTempFiles()
        {
            List<FileModel> files = _file.Find(file => file.username == "").ToList();
            foreach (var file in files)
            {
                if ((DateTime.Now.ToUniversalTime() - file.date).TotalDays >= 1)
                {
                    Delete(file._id);
                    if (File.Exists(file.path))
                        File.Delete(file.path);
                }
            }
        }
    }
}
