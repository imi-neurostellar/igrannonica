
using api.Models;

namespace api.Services
{
    public interface IDatasetService
    {
        Dataset GetOneDataset(string username, string name);
        List<Dataset> GetAllDatesets(string username);
        Dataset Create(Dataset dataset);
        void Update(string username, string name, Dataset dataset);
        void Delete(string username, string name);
    }
}
