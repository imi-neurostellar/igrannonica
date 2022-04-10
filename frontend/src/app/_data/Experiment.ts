export default class Experiment {
    _id: string = '';
    uploaderId: string = '';
    constructor(
        public name: string = 'Novi experiment',
        public description: string = '',
        public datasetId: string = '',
        public inputColumns: string[] = [],
        public columnToPredict: string = '',
        public nullValues: NullValueOptions = NullValueOptions.DeleteRows,
        public nullValuesReplacers: NullValReplacer[] = [],
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date()
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