
using api.Models;

namespace api.Services
{
    public interface IMlConnectionService
    {
        Task<string> SendModelAsync(object model, object dataset);
        Task PreProcess(Dataset dataset, string filePath);
        Task PreProcess(Experiment experiment, string filePath);
        Task PreProcess(Predictor predictor, string filePath);
        //Task<Dataset> PreProcess(Dataset dataset, byte[] file, string filename);
    }
}