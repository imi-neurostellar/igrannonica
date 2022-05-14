import { FolderFile } from "./FolderFile";

export default class Predictor extends FolderFile {
    constructor(
        name: string = 'Novi prediktor',
        public description: string = '',
        public inputs: string[] = [],
        public output: string = '',
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        dateCreated: Date = new Date(),
        lastUpdated: Date = new Date(),
        public uploaderId: string = '',
        //public finalMetrics: Metric[] = []
        public experimentId: string = "",
        public modelId: string = "",
    ) {
        super(name, dateCreated, lastUpdated);
    }
}

export class Metric {
    constructor(
        public name: string = '',
        public jsonValue: string = ''
    ) { }

}