"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.ConflictExpetion = exports.NotFoundExpetion = exports.BadRequestExpetion = exports.ApplicationExpition = void 0;
class ApplicationExpition extends Error {
    statusCode;
    constructor(message, statusCode = 400, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationExpition = ApplicationExpition;
class BadRequestExpetion extends ApplicationExpition {
    constructor(message, options) {
        super(message, 400, options);
    }
}
exports.BadRequestExpetion = BadRequestExpetion;
class NotFoundExpetion extends ApplicationExpition {
    constructor(message, options) {
        super(message, 404, options);
    }
}
exports.NotFoundExpetion = NotFoundExpetion;
class ConflictExpetion extends ApplicationExpition {
    constructor(message, options) {
        super(message, 409, options);
    }
}
exports.ConflictExpetion = ConflictExpetion;
const globalErrorHandler = (err, req, res, next) => {
    return res.status(err.statusCode || 500)
        .json({
        message: err.message ||
            "Some thing Went Rong ",
        stack: process.env.MODE === "DEV" ? err.stack : undefined,
        cause: err.cause
    });
};
exports.globalErrorHandler = globalErrorHandler;
