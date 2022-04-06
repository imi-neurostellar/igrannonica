export default class Experiment {
    _id: string = '';
    constructor(
        public name: string = 'Novi experiment',
        public description: string = '',
        public datasetId: string = '',
        public inputColumns: string[] = [],
        public columnToPredict: string = '',
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date()
    ) { }
}