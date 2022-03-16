using RestSharp;

namespace api.Services
{
    public class MlConnectionService : IMlConnectionService
    {
        public async Task<string> SendModelAsync(object model)
        {
            RestClient client = new RestClient("http://localhost:5000");
            var request = new RestRequest("data", Method.Post);
            request.AddJsonBody(model);
            var result = await client.ExecuteAsync(request);
            return result.Content;//Response od ML microservisa

        }
    }
}
