export class FolderFile {
    constructor(
        public name: string,
        public dateCreated: Date,
        public lastUpdated: Date
    ) { }
}


export enum FolderType {
    Dataset,
    Model
}