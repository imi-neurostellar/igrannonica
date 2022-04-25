import { NgIf } from "@angular/common";

export default class Model {
    _id: string = '';
    constructor(
        public name: string = 'Novi model',
        public description: string = '',
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date(),
        //public experimentId: string = '',

        // Neural net training settings
        public type: ProblemType = ProblemType.Regression,
        public optimizer: Optimizer = Optimizer.Adam,
        public lossFunction: LossFunction = LossFunction.MeanSquaredError,
        public inputNeurons: number = 1,
        public hiddenLayerNeurons: number=1,
        public hiddenLayers: number = 1,
        public batchSize: number = 5,
        public hiddenLayerActivationFunctions: string[] = ['sigmoid'],
        public outputLayerActivationFunction: ActivationFunction = ActivationFunction.Sigmoid,
        public uploaderId: string = '',
        public metrics: string[] = [], // TODO add to add-model form
        public epochs: number = 5, // TODO add to add-model form
        public inputColNum:number=5,
        public learningRate:number=0.01
    ) { }
}

export enum ProblemType {
    Regression = 'regresioni',
    BinaryClassification = 'binarni-klasifikacioni',
    MultiClassification = 'multi-klasifikacioni'
}

// replaceMissing srednja vrednost mean, median, najcesca vrednost (mode)
// removeOutliers

export enum ActivationFunction {
    // linear
    Binary_Step = 'binaryStep',
    // non-linear
    Leaky_Relu = 'leakyRelu',
    Parameterised_Relu = 'parameterisedRelu',
    Exponential_Linear_Unit = 'exponentialLinearUnit',
    Swish = 'swish',
    //hiddenLayers
    Relu = 'relu',
    Sigmoid = 'sigmoid',
    Tanh = 'tanh',

    //outputLayer
    Linear = 'linear',
    //Sigmoid='sigmoid',
    Softmax = 'softmax',
}
/*
export enum ActivationFunctionHiddenLayer
{
    Relu='relu',
    Sigmoid='sigmoid',
    Tanh='tanh'
}
export enum ActivationFunctionOutputLayer
{
    Linear = 'linear',
    Sigmoid='sigmoid',
    Softmax='softmax'
}
*/
export enum LossFunction {
    // binary classification loss functions
    BinaryCrossEntropy = 'binary_crossentropy',
    SquaredHingeLoss = 'squared_hinge_loss',
    HingeLoss = 'hinge_loss',
    // multi-class classification loss functions
    CategoricalCrossEntropy = 'categorical_crossentropy',
    SparseCategoricalCrossEntropy = 'sparse_categorical_crossentropy',
    KLDivergence = 'kullback_leibler_divergence',

    // regression loss functions

    MeanAbsoluteError = 'mean_absolute_error',
    MeanSquaredError = 'mean_squared_error',
    MeanSquaredLogarithmicError = 'mean_squared_logarithmic_error',
    HuberLoss = 'Huber'
}
export enum LossFunctionRegression {
    MeanAbsoluteError = 'mean_absolute_error',
    MeanSquaredError = 'mean_squared_error',
    MeanSquaredLogarithmicError = 'mean_squared_logarithmic_error',
}
export enum LossFunctionBinaryClassification {
    BinaryCrossEntropy = 'binary_crossentropy',
    SquaredHingeLoss = 'squared_hinge_loss',
    HingeLoss = 'hinge_loss',
}
export enum LossFunctionMultiClassification {
    CategoricalCrossEntropy = 'categorical_crossentropy',
    SparseCategoricalCrossEntropy = 'sparse_categorical_crossentropy',
    KLDivergence = 'kullback_leibler_divergence',
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
    None = 'Popuni...',
    Mean = 'Srednja vrednost',
    Median = 'Medijana'
}

export class NullValReplacer {
    "column": string;
    "option": NullValueOptions;
    "value": string;
}

export enum Metrics {
    MSE = 'mse',
    MAE = 'mae',
    RMSE = 'rmse'

}
export enum MetricsRegression {
    Mse = 'mse',
    Mae = 'mae',
    Mape = 'mape',
    Msle = 'msle',
    CosineProximity = 'cosine'
}
export enum MetricsBinaryClassification {
    Accuracy = 'binary_accuracy',
    Auc = "AUC",
    Precision = 'precision_score',
    Recall = 'recall_score',
    F1 = 'f1_score',


}
export enum MetricsMultiClassification {
    Accuracy = 'categorical_accuracy',
    Auc = "AUC",
    Precision = 'precision_score',
    Recall = 'recall_score',
    F1 = 'f1_score',
}