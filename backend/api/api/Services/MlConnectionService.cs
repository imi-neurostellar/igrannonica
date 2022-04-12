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
        private readonly IChat _chat;

        public MlConnectionService(IDatasetService datasetService,IChat chat)
        {
            this.client = new RestClient("http://127.0.0.1:5543");
            _datasetService=datasetService;
            _chat=chat;
        }

        public async Task<string> SendModelAsync(object model, object dataset)//Don't Use
        {
            var request = new RestRequest("train", Method.Post);
            request.AddJsonBody(new { model, dataset});
            var result = await this.client.ExecuteAsync(request);
            return result.Content; //Response od ML microservisa
        }
        public async Task TrainModel(Model model, Experiment experiment, string filePath)
        {
            var request = new RestRequest("train", Method.Post);
            request.AddParameter("model", JsonConvert.SerializeObject(model));
            request.AddParameter("experiment", JsonConvert.SerializeObject(experiment));
            //request.AddFile("file", file,filename);
            request.AddFile("file", filePath);
            request.AddHeader("Content-Type", "multipart/form-data");
            var result = await this.client.ExecuteAsync(request);

            Model newModel = JsonConvert.DeserializeObject<Model>(result.Content);
            newModel.isTrained = true;
            _modelService.Update(newModel._id, newModel);

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
            await _chat.SendDirect(id, "Procesed dataset with name "+newDataset.name);
            return;

        }

        


    }
}
