export default class Model {
    _id: string = '';
    constructor(
        public name: string = 'Novi model',
        public description: string = '',
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date(),
        public datasetId: string = '',

        // Test set settings
        public inputColumns: string[] = [],
        public columnToPredict: string = '',
        public randomOrder: boolean = true,
        public randomTestSet: boolean = true,
        public randomTestSetDistribution: number = 0.1, //0.1-0.9 (10% - 90%) JESTE OVDE ZAKUCANO 10, AL POSLATO JE KAO 0.1 BACK-U

        // Neural net training settings
        public type: ANNType = ANNType.FullyConnected,
        public encoding: Encoding = Encoding.Label,
        public optimizer: Optimizer = Optimizer.Adam,
        public lossFunction: LossFunction = LossFunction.MeanSquaredError,
        public inputNeurons: number = 1,
        public hiddenLayerNeurons: number = 1,
        public hiddenLayers: number = 1,
        public batchSize: number = 5,
        public inputLayerActivationFunction: ActivationFunction = ActivationFunction.Sigmoid,
        public hiddenLayerActivationFunction: ActivationFunction = ActivationFunction.Sigmoid,
        public outputLayerActivationFunction: ActivationFunction = ActivationFunction.Sigmoid,
        public username: string = '',
        public nullValues: NullValueOptions = NullValueOptions.DeleteRows,
        public nullValuesReplacers = []
    ) { }
}

export enum ANNType {
    FullyConnected = 'potpuno povezana',
    Convolutional = 'konvoluciona'
}

// replaceMissing srednja vrednost mean, median, najcesca vrednost (mode)
// removeOutliers
export enum Encoding {
    Label = 'label',
    OneHot = 'one hot',
    BackwardDifference = 'backward difference',
    BaseN = 'baseN',
    Binary = 'binary',
    CatBoost = 'cat boost',
    Count = 'count',
    GLMM = 'glmm',
    Hashing = 'hashing',
    Helmert = 'helmert',
    JamesStein = 'james stein',
    LeaveOneOut = 'leave one out',
    MEstimate = 'MEstimate',
    Ordinal = 'ordinal',
    Sum = 'sum',
    Polynomial = 'polynomial',
    Target = 'target',
    WOE = 'woe',
    Quantile = 'quantile'
}

export enum ActivationFunction {
    // linear
    Binary_Step = 'binaryStep',
    Linear = 'linear',
    // non-linear
    Relu = 'relu',
    Leaky_Relu = 'leakyRelu',
    Parameterised_Relu = 'parameterisedRelu',
    Exponential_Linear_Unit = 'exponentialLinearUnit',
    Swish = 'swish',
    Sigmoid = 'sigmoid',
    Tanh = 'tanh',
    Softmax = 'softmax'
}

export enum LossFunction {
    // binary classification loss functions
    BinaryCrossEntropy = 'binary_crossentropy',
    HingeLoss = 'hinge_loss',
    // multi-class classiication loss functions
    CategoricalCrossEntropy = 'categorical_crossentropy',
    KLDivergence = 'kullback_leibler_divergence',
    // regression loss functions
    MeanSquaredError = 'mean_squared_error',
    MeanAbsoluteError = 'mean_absolute_error',
    HuberLoss = 'Huber',
}

export enum Optimizer {
    Adam = 'Adam',
    Adadelta = 'Adadelta',
    Adagrad = 'Adagrad',
    Ftrl = 'Ftrl',
    Nadam = 'Nadam',
    SGD = 'SGD',
    SGDMomentum = 'SGDMomentum',
    RMSprop = 'RMSprop'
}

export enum NullValueOptions {
    DeleteRows = 'delete_rows',
    DeleteColumns = 'delete_columns',
    Replace = 'replace'
}

export enum ReplaceWith {
    None = '...',
    Mean = 'Srednja vrednost',
    Median = 'Medijana'
}