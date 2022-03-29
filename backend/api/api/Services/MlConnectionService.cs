using RestSharp;
using System.Net.WebSockets;
using System.Text;

namespace api.Services
{
    public class MlConnectionService : IMlConnectionService
    {
        private RestClient client;

        public MlConnectionService()
        {
            this.client = new RestClient("http://127.0.0.1:5543");
        }

        public async Task<string> SendModelAsync(object model, object dataset)
        {
            var request = new RestRequest("train", Method.Post);
            request.AddJsonBody(new { model, dataset});
            var result = await this.client.ExecuteAsync(request);
            return result.Content; //Response od ML microservisa
        }
    }
}
