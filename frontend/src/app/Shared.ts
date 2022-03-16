class Shared {
    constructor(
        public loggedIn: boolean,
        public username: string = ''
    ) { }
}

export default new Shared(false);