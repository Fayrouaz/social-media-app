"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const token_1 = require("../Utils/security/token");
const error_response_1 = require("../Utils/response/error.response");
const authentication = ({ tokenType = token_1.tokenTypeEnum.ACCESS, accessRoles }) => {
    return async (req, res, next) => {
        if (!req.headers.authorization)
            throw new error_response_1.BadRequestExpetion("Missing Authorization headers");
        const { decode, user } = await (0, token_1.decodedToken)({ authorizition: req.headers.authorization, tokenType });
        if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
            throw new error_response_1.ForbiddedExpetion("You Are Not Authorized to access this route");
        }
        req.decode = decode;
        req.user = user;
        return next();
    };
};
exports.authentication = authentication;
