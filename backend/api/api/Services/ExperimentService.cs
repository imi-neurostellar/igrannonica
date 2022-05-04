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
        public Experiment Get(string uploaderId, string name)
        {
            return _experiment.Find(exp => exp.uploaderId == uploaderId && exp.name == name ).FirstOrDefault();
        }

        public void Update(string id, Experiment experiment)
        {
            _experiment.ReplaceOne(experiment => experiment._id == id, experiment);
        }
        public List<Experiment> GetMyExperiments(string id)
        {
            return _experiment.Find(e=>e.uploaderId==id).ToList();

        }

        public Experiment GetOneExperiment(string userId, string name)
        {
            return _experiment.Find(experiment => experiment.uploaderId == userId && experiment.name == name).FirstOrDefault();
        }

        public void Update(string userId, string id, Experiment experiment)
        {
            _experiment.ReplaceOne(experiment => experiment.uploaderId == userId && experiment._id == id, experiment);
        }
    }
}
