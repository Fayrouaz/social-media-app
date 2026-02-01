"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const token_1 = require("../Utils/security/token");
const error_response_1 = require("../Utils/response/error.response");
const authentication = (tokenType = token_1.tokenTypeEnum.ACCESS, accessRoles = []) => {
    return async (req, res, next) => {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                return next(new error_response_1.BadRequestExpetion("Missing Authorization headers"));
            }
            const { decode, user } = await (0, token_1.decodedToken)({
                authorizition: authorization,
                tokenType: tokenType
            });
            if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
                return next(new error_response_1.ForbiddedExpetion("You Are Not Authorized to access this route"));
            }
            req.user = user;
            req.decode = decode;
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.authentication = authentication;
