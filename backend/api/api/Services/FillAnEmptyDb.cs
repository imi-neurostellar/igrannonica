using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class FillAnEmptyDb
    {
        private readonly IMongoCollection<Dataset> _dataset;
        private readonly IMongoCollection<Model> _model;
        private readonly IMongoCollection<Predictor> _predictor;
        private readonly IDatasetService _datasetService;

        public FillAnEmptyDb(IUserStoreDatabaseSettings settings, IMongoClient mongoClient, IDatasetService datasetService)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _dataset = database.GetCollection<Dataset>(settings.DatasetCollectionName);
            _model = database.GetCollection<Model>(settings.ModelCollectionName);
            _predictor = database.GetCollection<Predictor>(settings.PredictorCollectionName);

            _datasetService = datasetService;

        }

        public void AddToEmptyDb()
        {

            if (_datasetService.CheckDb())
            {
                //prvo dodati fajl 3 csv-a
                Dataset dataset = new Dataset();

                dataset._id = "";
                dataset.username = "Igrannonica";
                dataset.name = "Titanik";
                dataset.description = "Opis dataseta 1";
                dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = "";//DODAAAAAJ
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                dataset.nullCols = 3;
                dataset.nullRows = 708;
                dataset.isPreProcess = false;

                _datasetService.Create(dataset);


                dataset.name = "Igrannonica dataset 2";
                dataset.description = "Opis dataseta 2";
                dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = "";
                dataset.extension = ".csv";
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                dataset.nullCols = 0;
                dataset.nullRows = 0;
                dataset.isPreProcess = false;

                _datasetService.Create(dataset);


                dataset.name = "Igrannonica dataset 3";
                dataset.description = "Opis dataseta 3";
                dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = "";
                dataset.extension = ".csv";
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                dataset.nullCols = 0;
                dataset.nullRows = 0;
                dataset.isPreProcess = false;

                _datasetService.Create(dataset);
            }

        }


    }
}
