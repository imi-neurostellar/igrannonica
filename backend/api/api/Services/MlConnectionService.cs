using api.Models;
using RestSharp;
using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;

namespace api.Services
{
    public class MlConnectionService : IMlConnectionService
    {
        private RestClient client;
        private readonly IDatasetService _datasetService;
        private readonly IModelService _modelService;
        private readonly IHubContext<ChatHub> _ichat;
        private readonly IConfiguration _configuration;

        public MlConnectionService(IConfiguration configuration,IDatasetService datasetService,IHubContext<ChatHub> ichat)
        {
            _configuration = configuration;

            this.client = new RestClient(_configuration.GetValue<string>("AppSettings:MlApi"));
            _datasetService=datasetService;
            _ichat=ichat;

        }

        public async Task<string> SendModelAsync(object model, object dataset)//Don't Use
        {
            var request = new RestRequest("train", Method.Post);
            request.AddJsonBody(new { model, dataset});
            var result = await this.client.ExecuteAsync(request);
            return result.Content; //Response od ML microservisa
        }
        public async Task TrainModel(Model model, Experiment experiment, string filePath,Dataset dataset,string id)
        {
            var request = new RestRequest("train", Method.Post);
            request.AddParameter("model", JsonConvert.SerializeObject(model));
            request.AddParameter("experiment", JsonConvert.SerializeObject(experiment));
            request.AddParameter("dataset", JsonConvert.SerializeObject(dataset));
            //request.AddFile("file", file,filename);
            request.AddFile("file", filePath);
            request.AddHeader("Content-Type", "multipart/form-data");
            var result = await this.client.ExecuteAsync(request);

            if (ChatHub.CheckUser(id))
                await _ichat.Clients.Client(ChatHub.Users[id]).SendAsync("NotifyModel", "Trained model with name " +model.name );

            return;

        }
        public async Task PreProcess(Dataset dataset,string filePath,string id)//(Dataset dataset,byte[] file,string filename)
        {
            var request=new RestRequest("preprocess", Method.Post);
            request.AddParameter("dataset", JsonConvert.SerializeObject(dataset));
            //request.AddFile("file", file,filename);
            request.AddFile("file", filePath);
            request.AddHeader("Content-Type", "multipart/form-data");
            var result=await this.client.ExecuteAsync(request);

            Dataset newDataset = JsonConvert.DeserializeObject<Dataset>(result.Content);
            newDataset.isPreProcess = true;
            _datasetService.Update(newDataset);
            if(ChatHub.CheckUser(id))
                await _ichat.Clients.Client(ChatHub.Users[id]).SendAsync("NotifyDataset", "Preprocessed dataset with name "+newDataset.name,newDataset._id);
            return;

        }

        


    }
}
