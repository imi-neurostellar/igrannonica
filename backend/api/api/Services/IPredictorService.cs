using System;
using api.Models;

namespace api.Services
{
	public interface IPredictorService
	{
        Predictor GetOnePredictor(string username, string name);
        List<Predictor> SearchPredictors(string name, string username);
        List<Predictor> GetMyPredictors(string username);
        List<Predictor> SortPredictors(string username, bool ascdsc, int latest);
        List<Predictor> GetPublicPredictors();
        Predictor Create(Predictor predictor);
        void Update(string username, string name, Predictor predictor);
        void Delete(string username, string name);
    }
}

