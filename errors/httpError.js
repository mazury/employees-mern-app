class httpError extends Error {
    constructor (message) {
        super();
        this.code = 400;
        this.message = message;
    }
}

module.exports = httpError;