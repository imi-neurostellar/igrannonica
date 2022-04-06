export default class Dataset {
    _id: string = '';
    constructor(
        public name: string = 'Novi izvor podataka',
        public description: string = '',
        public header: string[] = [],
        public fileId?: number,
        public extension: string = '.csv',
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        public dateCreated: Date = new Date(),
        public lastUpdated: Date = new Date(),
        public username: string = '',
        public delimiter: string = '',
        public hasHeader: boolean = true,

        public columnInfo: ColumnInfo[] = [],
        public preview: string[][] = [[]]
    ) { }
}

export class ColumnInfo {
    constructor(
        public name: string = '',
        public isNumber: boolean = false,
        public numNull: number = 0,
        public uniqueValues?: string[],
        public median?: number,
        public mean?: number,
        public min?: number,
        public max?: number
    ) { }
}