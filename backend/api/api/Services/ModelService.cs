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

        public void Delete(string uploaderId, string name)
        {
            _model.DeleteOne(model => (model.uploaderId == uploaderId && model.name == name));
        }

        public List<Model> GetAllModels(string uploaderId)
        {
            return _model.Find(model => model.uploaderId == uploaderId).ToList();
        }

        public Model GetOneModel(string uploaderId, string name)
        {
            return _model.Find(model => model.uploaderId == uploaderId && model.name == name).FirstOrDefault();
        }

        public void Update(string uploaderId, string name, Model model)
        {
            _model.ReplaceOne(model => model.uploaderId == uploaderId && model.name == name, model);
        }
        
    }
}

