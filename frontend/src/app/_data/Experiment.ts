export default class Experiment {
    _id: string = '';
    uploaderId: string = '';
    constructor(
        public name: string = 'Novi eksperiment',
        public description: string = '',
        public datasetId: string = '',
        public inputColumns: string[] = [],
        public outputColumn: string = '',
        public nullValues: NullValueOptions = NullValueOptions.DeleteRows,
        public nullValuesReplacers: NullValReplacer[] = [],
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date(),
        public modelIds: string[] = [],

        

        public encodings: ColumnEncoding[] = []//[{columnName: "", columnEncoding: Encoding.Label}]
    ) { }
}

export enum NullValueOptions {
    DeleteRows = 'delete_rows',
    DeleteColumns = 'delete_columns',
    Replace = 'replace'
}

export enum ReplaceWith {
    None = 'Popuni...',
    Mean = 'Srednja vrednost',
    Median = 'Medijana',
    Min = 'Minimum',
    Max = 'Maksimum'
}

export class NullValReplacer {
    "column": string;
    "option": NullValueOptions;
    "value": string;
}

export enum Encoding {
    Label = 'label',
    OneHot = 'onehot',
    Ordinal = 'ordinal',
    Hashing = 'hashing',
    Binary = 'binary',
    BaseN = 'baseN'
    /*
    BackwardDifference = 'backward difference',
    CatBoost = 'cat boost',
    Count = 'count',
    GLMM = 'glmm',
    Target = 'target',
    Helmert = 'helmert',
    JamesStein = 'james stein',
    LeaveOneOut = 'leave one out',
    MEstimate = 'MEstimate',
    Sum = 'sum',
    Polynomial = 'polynomial',
    WOE = 'woe',
    Quantile = 'quantile'
    */
}

export class ColumnEncoding {
    constructor (
        public columnName: string,
        public encoding: Encoding
    ) 
    {}
}