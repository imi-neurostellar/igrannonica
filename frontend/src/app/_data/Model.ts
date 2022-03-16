export default class Model {
    constructor(
        public name: string = 'Novi model',
        public description: string = '',
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date(),
        public datasetId?: string,

        // Test set settings
        public inputColumns: string[] = [],
        public columnToPredict: string = '',
        public randomOrder: boolean = true,
        public randomTestSet: boolean = true,
        public randomTestSetDistribution: number = 0.10, //0.1-0.9 (10% - 90%)

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
        public outputLayerActivationFunction: ActivationFunction = ActivationFunction.Sigmoid
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
    OneHot = 'one hot'
}

export enum ActivationFunction {
    Relu = 'relu',
    Sigmoid = 'sigmoid',
    Tanh = 'tanh',
    Linear = 'linear'
}

export enum LossFunction {
    BinaryCrossEntropy = 'binary_crossentropy',
    MeanSquaredError = 'mean_squared_error'
}

export enum Optimizer {
    Adam = 'adam'
}