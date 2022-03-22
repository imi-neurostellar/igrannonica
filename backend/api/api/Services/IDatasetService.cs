
using api.Models;

namespace api.Services
{
    public interface IDatasetService
    {
        Dataset GetOneDataset(string username, string name);
        List<Dataset> SearchDatasets(string name, string username);
        List<Dataset> GetMyDatasets(string username);
        List<Dataset> SortDatasets(string username, bool ascdsc, int latest);
        List<Dataset> GetPublicDatasets();
        Dataset Create(Dataset dataset);
        void Update(string username, string name, Dataset dataset);
        void Delete(string username, string name);
    }
}
