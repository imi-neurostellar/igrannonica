using api.Models;

namespace api.Services
{
    public interface IPredictorService
    {
        Predictor Create(Predictor predictor);
        void Delete(string id);
        List<Predictor> GetMyPredictors(string username);
        Predictor GetOnePredictor(string id);
        Predictor GetPredictor(string username, string id);
        List<Predictor> GetPublicPredictors();
        List<Predictor> SortPredictors(string username, bool ascdsc, int latest);
        void Update(string id, Predictor predictor);
    }
}