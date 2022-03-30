using System;
using api.Models;

namespace api.Services
{
	public interface IModelService
	{
        Model GetOneModel(string username, string name);
        Model GetOneModel(string id);
        List<Model> GetMyModels(string username);
        List<Model> GetLatestModels(string username);
        //List<Model> GetPublicModels();
        Model Create(Model model);
        Model Replace(Model model);
        void Update(string username, string name, Model model);
        void Delete(string username, string name);
        bool CheckHyperparameters(int inputNeurons, int hiddenLayerNeurons, int hiddenLayers, int outputNeurons);
    }
}

