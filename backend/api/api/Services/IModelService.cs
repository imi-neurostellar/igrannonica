using System;
using api.Models;

namespace api.Services
{
	public interface IModelService
	{
        Model GetOneModel(string username, string name);
        List<Model> GetMyModels(string username);
        //List<Model> GetPublicModels();
        Model Create(Model model);
        void Update(string username, string name, Model model);
        void Delete(string username, string name);
    }
}

