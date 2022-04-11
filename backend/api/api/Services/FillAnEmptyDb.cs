using api.Interfaces;
using api.Models;
using MongoDB.Driver;

namespace api.Services
{
    public class FillAnEmptyDb : IHostedService
    {
        private readonly IFileService _fileService;
        private readonly IDatasetService _datasetService;
        private readonly IModelService _modelService;
        private readonly IExperimentService _experimentService;
        private readonly IPredictorService _predictorService;


        public FillAnEmptyDb(IUserStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);

            _fileService = new FileService(settings,mongoClient);
            _datasetService = new DatasetService(settings, mongoClient);
            _modelService = new ModelService(settings, mongoClient);
            _experimentService = new ExperimentService(settings, mongoClient);
            _predictorService = new PredictorService(settings, mongoClient);
        }



        //public void AddToEmptyDb()
        public Task StartAsync(CancellationToken cancellationToken)
        {

            if (_fileService.CheckDb())
            {
                /*
                FileModel file = new FileModel();

                string folderName = "UploadedFiles/Igrannonica";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), folderName, "Igrannonica");
                var fullPath = Path.Combine(folderPath, "titanic.csv");

                file._id = "";
                file.type = ".csv";
                file.uploaderId = "Igrannonica";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                Dataset dataset = new Dataset();

                dataset._id = "";
                dataset.username = "Igrannonica";
                dataset.name = "Titanik dataset";
                dataset.description = "Opis dataseta 1";
                dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = _fileService.GetFileId(fullPath);
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


                Model model = new Model();

                model._id = "";
                model.username = "Igrannonica";
                model.name = "Titanik model";
                model.description = "Opis modela 1";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.experimentId = "";
                model.type = "regresioni";
                model.encoding = "label";
                model.optimizer = "Adam";
                model.lossFunction = "mean_squared_error";
                model.hiddenLayerNeurons = 1;
                model.hiddenLayers = 1;
                model.batchSize = 5;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "sigmoid" };
                model.outputLayerActivationFunction = "sigmoid";
                model.metrics = new string[] { };
                model.epochs = 5;
                model.isTrained = false;

                _modelService.Create(model);


                Experiment experiment = new Experiment();

                experiment._id = "";
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "Igrannonica";
                experiment.inputColumns = new string[] { };
                experiment.outputColumn = "";
                experiment.randomOrder = false;
                experiment.randomTestSet = false;
                experiment.randomTestSetDistribution = 0;
                experiment.nullValues = "";
                experiment.nullValuesReplacers = new NullValues[] { };

                _experimentService.Create(experiment);


                Predictor predictor = new Predictor();

                predictor._id = "";
                predictor.username = "Igrannonica";
                predictor.name = "Igrannonica Predictor 1";
                predictor.description = "Opis predictora 1";
                //predictor.inputs = { 1, 3, 5, 7, 9 };
                predictor.output = "s";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = "0";
                //izmeni experiment id

                _predictorService.Create(predictor);

                //--------------------------------------------------------------------

                file = new FileModel();

                fullPath = Path.Combine(folderPath, "diamonds.csv");
                file._id = "";
                file.type = ".csv";
                file.uploaderId = "Igrannonica";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                dataset = new Dataset();

                dataset._id = "";
                dataset.username = "Igrannonica";
                dataset.name = "Diamonds dataset";
                dataset.description = "Opis dataseta 2";
                dataset.header = new string[] { "carat", "cut", "color", "clarity", "depth", "table", "price", "x", "y", "z" };
                dataset.fileId = _fileService.GetFileId(fullPath);
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                dataset.nullCols = 0;
                dataset.nullRows = 0;
                dataset.isPreProcess = false;

                _datasetService.Create(dataset);

                */
                /*
                model = new Model();

                model._id = "";
                model.username = "Igrannonica";
                model.name = "Igrannonica model 2";
                model.description = "Opis modela 2";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.experimentId = "";
                model.type = "";
                model.encoding = "";
                model.optimizer = "";
                model.lossFunction = "";
                model.hiddenLayerNeurons = 0;
                model.hiddenLayers = 0;
                model.batchSize = 0;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "sigmoid" };
                model.outputLayerActivationFunction = "";
                model.metrics = new string[] { };
                model.epochs = 0;
                model.isTrained = false;

                _modelService.Create(model);


                experiment = new Experiment();

                experiment._id = "";
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "Igrannonica";
                experiment.inputColumns = new string[] { };
                experiment.outputColumn = "";
                experiment.randomOrder = false;
                experiment.randomTestSet = false;
                experiment.randomTestSetDistribution = 0;
                experiment.nullValues = "";
                experiment.nullValuesReplacers = new NullValues[] { };
                
                _experimentService.Create(experiment);


                predictor = new Predictor();

                predictor._id = "";
                predictor.username = "Igrannonica";
                predictor.name = "Igrannonica Predictor 1";
                predictor.description = "Opis predictora 1";
                //predictor.inputs = { 1, 3, 5, 7, 9 };
                predictor.output = "s";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = "0";
                //izmeni experiment id

                _predictorService.Create(predictor);

                //--------------------------------------------------------------------

                file = new FileModel();

                fullPath = Path.Combine(folderPath, "IMDB-Movie-Data.csv");
                file._id = "";
                file.type = ".csv";
                file.uploaderId = "Igrannonica";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                dataset = new Dataset();

                dataset._id = "";
                dataset.username = "Igrannonica";
                dataset.name = "Igrannonica dataset 3";
                dataset.description = "Opis dataseta 3";
                dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = _fileService.GetFileId(fullPath);
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                dataset.nullCols = 0;
                dataset.nullRows = 0;
                dataset.isPreProcess = false;

                _datasetService.Create(dataset);


                model = new Model();

                model._id = "";
                model.username = "Igrannonica";
                model.name = "Igrannonica model 3";
                model.description = "Opis modela 3";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.experimentId = "";
                model.type = "";
                model.encoding = "";
                model.optimizer = "";
                model.lossFunction = "";
                model.hiddenLayerNeurons = 0;
                model.hiddenLayers = 0;
                model.batchSize = 0;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "sigmoid" };
                model.outputLayerActivationFunction = "";
                model.metrics = new string[] { };
                model.epochs = 0;
                model.isTrained = false;

                _modelService.Create(model);


                experiment = new Experiment();

                experiment._id = "";
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "Igrannonica";
                experiment.inputColumns = new string[] { };
                experiment.outputColumn = "";
                experiment.randomOrder = false;
                experiment.randomTestSet = false;
                experiment.randomTestSetDistribution = 0;
                experiment.nullValues = "";
                experiment.nullValuesReplacers = new NullValues[] { };
                
                _experimentService.Create(experiment);


                predictor = new Predictor();

                predictor._id = "";
                predictor.username = "Igrannonica";
                predictor.name = "Igrannonica Predictor 1";
                predictor.description = "Opis predictora 1";
                //predictor.inputs = { 1, 3, 5, 7, 9 };
                predictor.output = "s";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = "0";
                //izmeni experiment id

                _predictorService.Create(predictor);

                */
            }


            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

    }
}
