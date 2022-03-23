class Shared {
    constructor(
        public loggedIn: boolean,
        public username: string = '',
        public photoId: string = '1'
    ) { }
}

export default new Shared(false);