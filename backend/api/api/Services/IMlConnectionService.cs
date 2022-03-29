
namespace api.Services
{
    public interface IMlConnectionService
    {
        Task<string> SendModelAsync(object model, object dataset);
    }
}