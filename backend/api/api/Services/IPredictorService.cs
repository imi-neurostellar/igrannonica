using System;
using api.Models;

namespace api.Services
{
	public interface IPredictorService
	{
        Predictor GetOnePredictor(string username, string name);
        List<Predictor> GetMyPredictors(string username);
        List<Predictor> GetLatestPredictors(string username);
        List<Predictor> GetPublicPredictors();
        Predictor Create(Predictor predictor);
        void Update(string username, string name, Predictor predictor);
        void Delete(string username, string name);
    }
}

