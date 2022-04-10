using api.Models;

namespace api.Services
{
    public interface IExperimentService
    {
        Experiment Create(Experiment experiment);
        public Experiment Get(string id);
        public List<Experiment> GetMyExperiments(string id);
    }
}