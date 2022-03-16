using System;
using api.Models;

namespace api.Services
{
	public interface IModelService
	{
        Model GetOneModel(string username, string name);
        List<Model> GetAllModels(string username);
        Model Create(Model model);
        void Update(string username, string name, Model model);
        void Delete(string username, string name);
    }
}

