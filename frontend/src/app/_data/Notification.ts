export default class Notification {
    _id: string = '';
    constructor(
        public title: string = 'Treniranje u toku...',
        public id: string = '042',
        public progress: number = 0.5,
        public hasProgress: boolean = false
    ) { }
}