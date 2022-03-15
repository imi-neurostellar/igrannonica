export default class Dataset {
    constructor(
        public name: string = 'Novi izvor podataka',
        public description: string = '',
        public columns: string[] = [],
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        public dateCreated: Date = new Date()
    ) { }
}