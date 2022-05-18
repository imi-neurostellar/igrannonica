import { FolderFile } from "./FolderFile";

export default class Predictor extends FolderFile {
    constructor(
        name: string = 'Novi prediktor',
        
        public uploaderId: string = '',
        public inputs: string[] = [],
        public output: string = '',
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        dateCreated: Date = new Date(),
        public experimentId: string = "",
        public modelId: string = "",
        public h5FileId: string = "",
        public metrics: Metric[] = [],
        public finalMetrics: Metric[] = []
    ) {
        super(name, dateCreated, dateCreated);
    }
}

export class Metric {
    constructor(
        public name: string = '',
        public jsonValue: string = ''
    ) { }

}