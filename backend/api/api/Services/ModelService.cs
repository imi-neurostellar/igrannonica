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
        
    }
}

