
using api.Models;

namespace api.Services
{
    public interface IDatasetService
    {
        Dataset Get(string uploaderId);
        Dataset Create(Dataset dataset);
        void Update(string uploaderId, Dataset dataset);
        void Delete(string uploaderId, string name);
    }
}
