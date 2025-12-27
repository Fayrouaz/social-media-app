"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const validation_middleware_1 = require("../../Middleware/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const token_1 = require("../../Utils/security/token");
const authentication_middleware_1 = require("../../Middleware/authentication.middleware");
const cloud_multer_1 = require("../../Utils/multer/cloud.multer");
const router = (0, express_1.Router)();
router.post("/signup", (0, validation_middleware_1.validation)(auth_validation_1.signUpSchema), auth_service_1.default.signup);
router.post("/login", auth_service_1.default.login);
router.patch("/confirm-email", (0, validation_middleware_1.validation)(auth_validation_1.confirmEmislOtpSchema), auth_service_1.default.confirmEmial);
router.post("/revoke-token", (0, authentication_middleware_1.authentication)({
    tokenType: token_1.tokenTypeEnum.ACCESS,
    accessRoles: []
}), auth_service_1.default.logout);
router.patch("/refresh-token", (0, authentication_middleware_1.authentication)({ tokenType: token_1.tokenTypeEnum.REFRESH, accessRoles: [] }), auth_service_1.default.refreshToken);
router.patch("/profile-image", (0, authentication_middleware_1.authentication)({ tokenType: token_1.tokenTypeEnum.REFRESH, accessRoles: [] }), (0, cloud_multer_1.cloudFileUplaod)({
    validation: cloud_multer_1.validationFile.images,
    storageApproch: cloud_multer_1.StorageEnum.MEMORY,
    maxSizeMB: 3
}).single, auth_service_1.default.profileImage);
exports.default = router;
