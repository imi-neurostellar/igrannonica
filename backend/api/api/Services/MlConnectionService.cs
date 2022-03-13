using RestSharp;

namespace api.Services
{
    public class MlConnectionService : IMlConnectionService
    {
        public async Task<string> SendModelAsync(object model)
        {
            RestClient client = new RestClient("https://jsonplaceholder.typicode.com");//Promeniti na python api kad se odradi
            var request = new RestRequest("posts", Method.Post);//Promeniti na python api kad se odradi
            request.AddJsonBody(model);
            var result = await client.ExecuteAsync(request);
            return result.Content;//Response od ML microservisa

        }
    }
}
