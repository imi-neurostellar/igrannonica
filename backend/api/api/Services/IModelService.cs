using System;
using api.Models;

namespace api.Services
{
	public interface IModelService
	{
        Model GetOneModel(string uploaderId, string name);
        List<Model> GetAllModels(string uploaderId);
        Model Create(Model model);
        void Update(string uploaderId, string name, Model model);
        void Delete(string uploaderId, string name);
    }
}

