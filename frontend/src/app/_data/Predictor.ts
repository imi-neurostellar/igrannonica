export default class Dataset {
    constructor(
        public name: string = 'Novi izvor podataka',
        public description: string = '',
        public inputs: string[] = [],
        public output: string = '',
        public dateCreated: Date = new Date()
    ) { }
}