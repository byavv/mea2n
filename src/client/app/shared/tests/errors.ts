export class UnauthorizedAccessError extends Error {
    constructor(message) {
        super(message);
    }
    name = "UnauthorizedAccessError";
    status = 401;
}

export class ServerError extends Error {
    constructor(message) {
        super(message);
    }
    name = "Internal server error";
    status = 500;
}