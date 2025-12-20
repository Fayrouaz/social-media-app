"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodedToken = exports.createLoginCreditionals = exports.getSignature = exports.getSignatureLevel = exports.verifyToken = exports.generateToken = exports.tokenTypeEnum = exports.SignatureLevelEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../../DB/models/user.model");
const uuid_1 = require("uuid");
const error_response_1 = require("../response/error.response");
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
var SignatureLevelEnum;
(function (SignatureLevelEnum) {
    SignatureLevelEnum["USER"] = "USER";
    SignatureLevelEnum["ADMIN"] = "ADMIN";
})(SignatureLevelEnum || (exports.SignatureLevelEnum = SignatureLevelEnum = {}));
var tokenTypeEnum;
(function (tokenTypeEnum) {
    tokenTypeEnum["ACCESS"] = "ACCESS";
    tokenTypeEnum["REFRESH"] = "REFRESH";
})(tokenTypeEnum || (exports.tokenTypeEnum = tokenTypeEnum = {}));
const generateToken = async ({ payload, secret, options }) => {
    return await (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = async ({ token, secret }) => {
    return await (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
const getSignatureLevel = async (role = user_model_1.roleEnum.USER) => {
    let signatureLevel = SignatureLevelEnum.USER;
    switch (role) {
        case user_model_1.roleEnum.ADMIN:
            signatureLevel = SignatureLevelEnum.ADMIN;
            break;
        case user_model_1.roleEnum.USER:
            signatureLevel = SignatureLevelEnum.USER;
            break;
        default:
            break;
    }
    return signatureLevel;
};
exports.getSignatureLevel = getSignatureLevel;
const getSignature = async (signatureLevel = SignatureLevelEnum.USER) => {
    let signatures = { access_token: "", access_refresh: "" };
    switch (signatureLevel) {
        case SignatureLevelEnum.ADMIN:
            signatures.access_token = process.env.ACCESS_ADMIN_TOKEN_SECRET;
            signatures.access_refresh = process.env.REFRESH_ADMIN_TOKEN_SECRET;
            break;
        case SignatureLevelEnum.USER:
            signatures.access_token = process.env.ACCESS_USER_TOKEN_SECRET;
            signatures.access_refresh = process.env.REFRESH_USER_TOKEN_SECRET;
        default:
            break;
    }
    return signatures;
};
exports.getSignature = getSignature;
const createLoginCreditionals = async (user) => {
    const signatureLevel = await (0, exports.getSignatureLevel)(user.role);
    const signatures = await (0, exports.getSignature)(signatureLevel);
    const jwtid = (0, uuid_1.v4)();
    const access_token = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: signatures.access_token,
        options: { expiresIn: Number(process.env.ACCESS_EXPIRES_IN), jwtid }
    });
    const access_refresh = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: signatures.access_refresh,
        options: { expiresIn: Number(process.env.REFRESH_EXPIRES_IN), jwtid }
    });
    return { access_token, access_refresh };
};
exports.createLoginCreditionals = createLoginCreditionals;
const decodedToken = async ({ authorizition, tokenType = tokenTypeEnum.ACCESS }) => {
    const userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    const [bearer, token] = authorizition.split(" ");
    if (!token || !bearer)
        throw new error_response_1.UnothorizedtExpetion("Missing Token Parts👨‍🦯");
    const signatures = await (0, exports.getSignature)(bearer);
    console.log("Checking Token for:", tokenType);
    console.log("Secret used:", tokenType === tokenTypeEnum.REFRESH ? "Using Refresh Secret" : "Using Access Secret");
    const decode = await (0, exports.verifyToken)({ token, secret: tokenType === tokenTypeEnum.REFRESH ? signatures.access_refresh : signatures.access_token });
    if (!decode?._id || !decode.iat)
        throw new error_response_1.UnothorizedtExpetion("Invalid Token Payload");
    const user = await userModel.findById({ id: { _id: decode._id } });
    if (!user)
        throw new error_response_1.NotFoundExpetion("User Not Found");
    return { user, decode };
};
exports.decodedToken = decodedToken;
