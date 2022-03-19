
using api.Models;

namespace api.Services
{
    public interface IDatasetService
    {
        Dataset GetOneDataset(string username, string name);
        List<Dataset> GetMyDatesets(string username); 
        List<Dataset> GetLatestDatasets(string username, int latest);
        List<Dataset> GetPublicDatesets();
        Dataset Create(Dataset dataset);
        void Update(string username, string name, Dataset dataset);
        void Delete(string username, string name);
    }
}
