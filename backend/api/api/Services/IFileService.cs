using api.Models;

namespace api.Services
{
    public interface IFileService
    {
        FileModel Create(FileModel file);
        void Delete(string id);
        void DeleteTempFiles();
        string GetFilePath(string id, string username);
    }
}