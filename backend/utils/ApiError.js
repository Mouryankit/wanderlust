class ApiError extends Error {
    constructor(statusCode, message) {
        // super(message); 
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ApiError;