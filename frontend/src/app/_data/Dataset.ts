export default class Dataset {
    constructor(
        public name: string = 'Novi izvor podataka',
        public description: string = '',
        public header: string[] = [],
        public fileId?: number,
        public extension: string = '.csv',
        public dateCreated: Date = new Date()
    ) { }
}