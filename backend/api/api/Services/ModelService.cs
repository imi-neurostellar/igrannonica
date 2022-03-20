using System;
using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
	public class ModelService : IModelService
    {
        private readonly IMongoCollection<Model> _model;

        public ModelService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _model = database.GetCollection<Model>(settings.ModelCollectionName);
        }

        public Model Create(Model model)
        {
            _model.InsertOne(model);
            return model;
        }

        public void Delete(string username, string name)
        {
            _model.DeleteOne(model => (model.username == username && model.name == name));
        }

        public List<Model> GetMyModels(string username)
        {
            return _model.Find(model => model.username == username).ToList();
        }
        public List<Model> GetLatestModels(string username)
        {
            List<Model> list = _model.Find(model => model.username == username).ToList();

            list = list.OrderByDescending(model => model.lastUpdated).ToList();

            return list;
        }

        /*
        public List<Model> GetPublicModels()
        {
            return _model.Find(model => model.isPublic == true).ToList();
        }
        */
        public Model GetOneModel(string username, string name)
        {
            return _model.Find(model => model.username == username && model.name == name).FirstOrDefault();
        }

        public void Update(string username, string name, Model model)
        {
            _model.ReplaceOne(model => model.username == username && model.name == name, model);
        }
        //
        public bool CheckHyperparameters(int inputNeurons, int hiddenLayerNeurons, int hiddenLayers, int outputNeurons)
        {
            if (hiddenLayers <= 0 || hiddenLayerNeurons <= 0)
                return false;
            if (hiddenLayers > inputNeurons)
                return false;
            if (hiddenLayerNeurons <= 2 * inputNeurons || hiddenLayerNeurons <= (2 / 3) * inputNeurons + outputNeurons || (hiddenLayerNeurons <= Math.Max(inputNeurons, outputNeurons) && hiddenLayerNeurons >= Math.Min(inputNeurons, outputNeurons)))
                return true;
            return false;
        }

        
    }
}

