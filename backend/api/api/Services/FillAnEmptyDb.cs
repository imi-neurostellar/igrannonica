using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.SignalR;
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

            _fileService = new FileService(settings, mongoClient);
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

                FileModel file = new FileModel();

                string folderName = "UploadedFiles";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), folderName, "000000000000000000000000");
                var fullPath = Path.Combine(folderPath, "titanic.csv");

                file._id = "";
                file.type = ".csv";
                file.uploaderId = "000000000000000000000000";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                Dataset dataset = new Dataset();

                dataset._id = "";
                dataset.uploaderId = "000000000000000000000000";
                dataset.name = "Titanik dataset";
                dataset.description = "Titanik dataset";
                //dataset.header = new string[] { "PassengerId", "Survived", "Pclass", "Name", "Sex", "Age", "SibSp", "Parch", "Ticket", "Fare", "Cabin", "Embarked" };
                dataset.fileId = _fileService.GetFileId(fullPath);
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                //dataset.hasHeader = true;
                dataset.columnInfo = new ColumnInfo[] { };
                /*dataset.columnInfo = new[]
                {
                    new ColumnInfo( "PassengerId", true, 0, 446, 1, 891, 446, new string[]{ }),
                    new ColumnInfo( "Survived", true, 0, 0.38383838534355164f, 0, 1, 0, new string[]{ }),
                    new ColumnInfo( "Pclass", true, 0, 2.3086419105529785f, 1, 3, 3, new string[]{ }),
                    new ColumnInfo( "Name", false, 0, 0, 0, 0, 0, new string[]{"Braund, Mr. Owen Harris", "Boulos, Mr. Hanna", "Frolicher-Stehli, Mr. Maxmillian", "Gilinski, Mr. Eliezer", "Murdlin, Mr. Joseph", "Rintamaki, Mr. Matti", "Stephenson, Mrs. Walter Bertram (Martha Eustis)", "Elsbury, Mr. William James", "Bourke, Miss. Mary", "Chapman, Mr. John Henry"}),
                    new ColumnInfo( "Sex", false, 0, 0, 0, 0, 0, new string[]{ "male", "female" }),
                    new ColumnInfo( "Age", true, 177, 29.69911766052246f, 0.41999998688697815f, 80, 28, new string[]{ }),
                    new ColumnInfo( "SibSp", true, 0, 0.523007869720459f, 0, 8, 0, new string[]{ }),
                    new ColumnInfo( "Parch", true, 0, 0.3815937042236328f, 0, 6, 0, new string[]{ }),
                    new ColumnInfo( "Ticket", false, 0, 0, 0, 0, 0, new string[]{ "347082", "CA. 2343", "1601", "3101295", "CA 2144", "347088", "S.O.C. 14879", "382652", "LINE", "PC 17757" }),
                    new ColumnInfo( "Fare", true, 0, 32.20420837402344f, 0, 512.3292236328125f, 14.45419979095459f, new string[]{ }),
                    new ColumnInfo( "Cabin", false, 687, 0, 0, 0, 0, new string[]{ "B96 B98", "G6", "C23 C25 C27", "C22 C26", "F33", "F2", "E101", "D", "C78", "C93" }),
                    new ColumnInfo( "Embarked", false, 2, 0.3815937042236328f, 0, 6, 0, new string[]{ "S", "C", "Q" }),
                };*/
                dataset.rowCount = 891;
                dataset.nullCols = 3;
                dataset.nullRows = 708;
                dataset.isPreProcess = true;

                _datasetService.Create(dataset);


                Model model = new Model();

                model._id = "";
                model.uploaderId = "000000000000000000000000";
                model.name = "Model Titanik";
                model.description = "Model Titanik";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.type = "binarni-klasifikacioni";
                model.optimizer = "Adam";
                model.lossFunction = "mean_squared_error";
                model.hiddenLayerNeurons = 3;
                model.hiddenLayers = 5;
                model.batchSize = 8;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "relu", "relu", "relu", "relu", "relu" };
                model.outputLayerActivationFunction = "sigmoid";
                model.metrics = new string[] { };
                model.epochs = 5;

                _modelService.Create(model);


                Experiment experiment = new Experiment();

                experiment._id = "";
                experiment.name = "Eksperiment Titanik";
                experiment.description = "Binarno klasifikacioni, label";
                experiment.ModelIds = new string[] { }.ToList();
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "000000000000000000000000";
                experiment.inputColumns = new string[] { "Embarked" };
                experiment.outputColumn = "Survived";
                experiment.randomOrder = true;
                experiment.randomTestSet = true;
                experiment.randomTestSetDistribution = 0.30000001192092896f;
                experiment.nullValues = "delete_rows";
                experiment.nullValuesReplacers = new NullValues[] { };
                experiment.encodings = new[]
                {
                    new ColumnEncoding( "Survived", "label" ),
                    new ColumnEncoding("Embarked", "label" )
                };

                _experimentService.Create(experiment);

                /*
                Predictor predictor = new Predictor();

                predictor._id = "";
                predictor.uploaderId = "000000000000000000000000";
                predictor.inputs = new string[] { "Embarked" };
                predictor.output = "Survived";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = experiment._id;//izmeni experiment id
                predictor.modelId = _modelService.getModelId("000000000000000000000000");
                predictor.h5FileId = ;
                predictor.metrics = new Metric[] { };


                _predictorService.Create(predictor);*/

                //--------------------------------------------------------------------

                file = new FileModel();

                fullPath = Path.Combine(folderPath, "diamonds.csv");
                file._id = "";
                file.type = ".csv";
                file.uploaderId = "000000000000000000000000";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                dataset = new Dataset();

                dataset._id = "";
                dataset.uploaderId = "000000000000000000000000";
                dataset.name = "Diamonds dataset";
                dataset.description = "Diamonds dataset";
                dataset.fileId = _fileService.GetFileId(fullPath);
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                //dataset.hasHeader = true;
                /*dataset.columnInfo = new[]
                 {
                    new ColumnInfo( "Unnamed: 0", true, 0, 26969.5f, 0, 53939, 26969.5f, new string[]{ }),
                    new ColumnInfo( "carat", true, 0, 0.7979397773742676f, 0.20000000298023224f, 5.010000228881836f, 0.699999988079071f, new string[]{ }),
                    new ColumnInfo( "cut", false, 0, 0, 0, 0, 0, new string[]{ "Ideal", "Premium", "Very Good", "Good", "Fair" }),
                    new ColumnInfo( "color", false, 0, 0, 0, 0, 0, new string[]{"G", "E", "F", "H", "D", "I", "I", "J"}),
                    new ColumnInfo( "clarity", false, 0, 0, 0, 0, 0, new string[]{ "SI1", "VS2","SI2", "VS1", "VVS2", "VVS1", "IF", "I1"  }),
                    new ColumnInfo( "depth", true, 0, 61.74940490722656f, 43, 79, 61.79999923706055f, new string[]{ }),
                    new ColumnInfo( "table", true, 0, 57.457183837890625f, 43, 95, 57, new string[]{ }),
                    new ColumnInfo( "price", true, 0, 3932.7998046875f, 326, 18823, 2401, new string[]{ }),
                    new ColumnInfo( "x", true, 0, 5.731157302856445f, 0, 10.739999771118164f, 5.699999809265137f, new string[]{  }),
                    new ColumnInfo( "y", true, 0, 5.73452615737915f, 0, 58.900001525878906f, 5.710000038146973f, new string[]{ }),
                    new ColumnInfo( "z", true, 0, 3.538733720779419f, 0, 31.799999237060547f, 3.5299999713897705f, new string[]{ })
                    };*/
                dataset.rowCount = 53940;
                dataset.nullCols = 0;
                dataset.nullRows = 0;
                dataset.isPreProcess = true;

                _datasetService.Create(dataset);



                model = new Model();

                model._id = "";
                model.uploaderId = "000000000000000000000000";
                model.name = "Diamonds model";
                model.description = "Diamonds model";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.type = "regresioni";
                model.optimizer = "Adam";
                model.lossFunction = "mean_absolute_error";
                model.hiddenLayerNeurons = 2;
                model.hiddenLayers = 4;
                model.batchSize = 5;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "relu", "relu", "relu", "relu" };
                model.outputLayerActivationFunction = "relu";
                model.metrics = new string[] { };
                model.epochs = 5;

                _modelService.Create(model);


                experiment = new Experiment();

                experiment._id = "";
                experiment.name = "Diamonds eksperiment";
                experiment.description = "Diamonds eksperiment";
                experiment.ModelIds = new string[] { }.ToList();
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "000000000000000000000000";
                experiment.inputColumns = new string[] { "Unnamed: 0", "carat", "cut", "color", "clarity", "depth", "table", "x", "y", "z" };
                experiment.outputColumn = "price";
                experiment.randomOrder = true;
                experiment.randomTestSet = true;
                experiment.randomTestSetDistribution = 0.30000001192092896f;
                experiment.nullValues = "delete_rows";
                experiment.nullValuesReplacers = new NullValues[] { };
                experiment.encodings = new[]
                 {
                    new ColumnEncoding( "Unnamed: 0", "label" ),
                    new ColumnEncoding( "carat", "label" ),
                    new ColumnEncoding( "cut", "label" ),
                    new ColumnEncoding( "color", "label" ),
                    new ColumnEncoding( "clarity", "label" ),
                    new ColumnEncoding( "depth", "label" ),
                    new ColumnEncoding( "table", "label" ),
                    new ColumnEncoding( "price", "label" ),
                    new ColumnEncoding( "x", "label" ),
                    new ColumnEncoding( "y", "label" ),
                    new ColumnEncoding( "z", "label" )
                };

                _experimentService.Create(experiment);
                /*
                predictor._id = "";
                predictor.uploaderId = "000000000000000000000000";
                predictor.inputs = new string[] { "Unnamed: 0", "carat", "cut", "color", "clarity", "depth", "table", "x", "y", "z" };
                predictor.output = "price";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = experiment._id;//izmeni experiment id
                predictor.modelId = _modelService.getModelId("000000000000000000000000");
                predictor.h5FileId = ;
                predictor.metrics = new Metric[] { };*/

                //--------------------------------------------------------------------

                file = new FileModel();

                fullPath = Path.Combine(folderPath, "iris.csv");
                file._id = "";
                file.type = ".csv";
                file.uploaderId = "000000000000000000000000";
                file.path = fullPath;
                file.date = DateTime.Now;

                _fileService.Create(file);


                dataset = new Dataset();

                dataset._id = "";
                dataset.uploaderId = "000000000000000000000000";
                dataset.name = "Iris dataset";
                dataset.description = "Iris dataset";
                dataset.fileId = _fileService.GetFileId(fullPath);
                dataset.extension = ".csv";
                dataset.isPublic = true;
                dataset.accessibleByLink = true;
                dataset.dateCreated = DateTime.Now;
                dataset.lastUpdated = DateTime.Now;
                dataset.delimiter = "";
                //dataset.hasHeader = true;
                /*dataset.columnInfo = new[]
                  {
                    new ColumnInfo( "sepal_length", true, 0, 5.8433332443237305f, 4.300000190734863f, 7.900000095367432f, 5.800000190734863f, new string[]{ }),
                    new ColumnInfo( "sepal_width", true, 0, 3.053999900817871f, 2, 4.400000095367432f, 3, new string[]{ }),
                    new ColumnInfo( "petal_length", true, 0, 3.758666753768921f, 1, 6.900000095367432f, 4.349999904632568f, new string[]{ }),
                    new ColumnInfo( "petal_width", true, 0, 1.1986666917800903f, 0.10000000149011612f, 2.5f, 1.2999999523162842f, new string[]{}),
                    new ColumnInfo( "class", false, 0, 0, 0, 0, 0, new string[]{ "Iris-setosa", "Iris-versicolor", "Iris-virginica" }),
                };*/
                dataset.nullCols = 150;
                dataset.nullRows = 0;
                dataset.isPreProcess = true;

                _datasetService.Create(dataset);


                model = new Model();

                model._id = "";
                model.uploaderId = "000000000000000000000000";
                model.name = "Model Iris";
                model.description = "Model Iris";
                model.dateCreated = DateTime.Now;
                model.lastUpdated = DateTime.Now;
                model.type = "multi-klasifikacioni";
                model.optimizer = "Adam";
                model.lossFunction = "sparse_categorical_crossentropy";
                model.hiddenLayerNeurons = 3;
                model.hiddenLayers = 3;
                model.batchSize = 4;
                model.outputNeurons = 0;
                model.hiddenLayerActivationFunctions = new string[] { "relu", "relu", "softmax" };
                model.outputLayerActivationFunction = "softmax";
                model.metrics = new string[] { };
                model.epochs = 1;

                _modelService.Create(model);


                experiment = new Experiment();

                experiment._id = "";
                experiment.name = "Iris eksperiment";
                experiment.description = "Iris eksperiment";
                experiment.ModelIds = new string[] { }.ToList();
                experiment.datasetId = _datasetService.GetDatasetId(dataset.fileId);
                experiment.uploaderId = "000000000000000000000000";
                experiment.inputColumns = new string[] { "sepal_length", "sepal_width", "petal_length", "petal_width" };
                experiment.outputColumn = "class";
                experiment.randomOrder = true;
                experiment.randomTestSet = true;
                experiment.randomTestSetDistribution = 0.20000000298023224f;
                experiment.nullValues = "delete_rows";
                experiment.nullValuesReplacers = new NullValues[] { };
                experiment.encodings = new[]
                 {
                    new ColumnEncoding( "sepal_length", "label" ),
                    new ColumnEncoding("sepal_width", "label" ),
                    new ColumnEncoding( "petal_length", "label" ),
                    new ColumnEncoding( "petal_width", "label" ),
                    new ColumnEncoding( "class", "label" )
                };

                _experimentService.Create(experiment);
                /*
                predictor._id = "";
                predictor.uploaderId = "000000000000000000000000";
                predictor.inputs = new string[] { "sepal_length", "sepal_width", "petal_length", "petal_width" };
                predictor.output = "class";
                predictor.isPublic = true;
                predictor.accessibleByLink = true;
                predictor.dateCreated = DateTime.Now;
                predictor.experimentId = experiment._id;//izmeni experiment id
                predictor.modelId = _modelService.getModelId("000000000000000000000000");
                predictor.h5FileId = ;
                predictor.metrics = new Metric[] { };*/

            }


            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

    }
}
