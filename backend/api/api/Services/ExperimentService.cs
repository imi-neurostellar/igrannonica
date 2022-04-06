using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class ExperimentService : IExperimentService
    {
        private readonly IMongoCollection<Experiment> _experiment;
        public ExperimentService(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _experiment = database.GetCollection<Experiment>(settings.ExperimentCollectionName);
        }

        public Experiment Create(Experiment experiment)
        {
            _experiment.InsertOne(experiment);
            return experiment;
        }
        public Experiment Get(string id)
        {
            return _experiment.Find(exp=>exp._id == id).FirstOrDefault();
        }
    }
}
