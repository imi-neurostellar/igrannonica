
using api.Models;

namespace api.Services
{
    public interface IDatasetService
    {
        Dataset GetOneDataset(string uploaderId, string name);
        List<Dataset> GetAllDatesets(string uploaderId);
        Dataset Create(Dataset dataset);
        void Update(string uploaderId, string name, Dataset dataset);
        void Delete(string uploaderId, string name);
    }
}
