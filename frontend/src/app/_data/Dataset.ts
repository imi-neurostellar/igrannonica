import { FolderFile } from "./FolderFile";

export default class Dataset extends FolderFile {
    _id: string = '';
    constructor(
        name: string = 'Novi izvor podataka',
        public description: string = '',
        public fileId?: number,
        public extension: string = '.csv',
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        dateCreated: Date = new Date(),
        lastUpdated: Date = new Date(),
        public uploaderId: string = '',
        public delimiter: string = ',',

        public columnInfo: ColumnInfo[] = [],
        public rowCount: number = 0,
        public nullRows: number = 0,
        public nullCols: number = 0,
        public cMatrix: number[][] = []
    ) {
        super(name, dateCreated, lastUpdated);
    }
}

export class ColumnInfo {
    constructor(
        public columnName: string = '',
        public isNumber: boolean = false,
        public numNulls: number = 0,
        public uniqueValues?: string[],
        public uniqueValuesCount?: number[],
        public uniqueValuesPercent?: number[],
        public median?: number,
        public mean?: number,
        public min?: number,
        public max?: number,
        public q1?: number,
        public q3?: number,
    ) {
        /*if (isNumber)
            this.columnType = ColumnType.numerical;
        else 
            this.columnType = ColumnType.categorical;*/
    }

}

