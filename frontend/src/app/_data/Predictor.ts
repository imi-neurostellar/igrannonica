export default class Predictor {
    constructor(
        public name: string = 'Novi prediktor',
        public description: string = '',
        public inputs: string[] = [],
        public output: string = '',
        public isPublic: boolean = false,
        public accessibleByLink: boolean = false,
        public dateCreated: Date = new Date()
    ) { }
}