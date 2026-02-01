"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const authentication_middleware_1 = require("../../Middleware/authentication.middleware");
const token_1 = require("../../Utils/security/token");
const user_model_1 = require("../../DB/models/user.model");
const cloud_multer_1 = require("../../Utils/multer/cloud.multer");
const chat_controller_1 = __importDefault(require("../chat/chat.controller"));
const router = (0, express_1.Router)();
router.use("/:userId/chat", chat_controller_1.default);
router.get("/profile", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.ACCESS, [user_model_1.roleEnum.USER]), user_service_1.default.getProfile);
router.patch("/profile-image", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.REFRESH, []), (0, cloud_multer_1.cloudFileUplaod)({
    validation: cloud_multer_1.validationFile.images,
    storageApproch: cloud_multer_1.StorageEnum.MEMORY,
    maxSizeMB: 6
}).single("attachments"), user_service_1.default.profileImage);
router.delete("/:userId/freeze-account", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.ACCESS, [user_model_1.roleEnum.USER, user_model_1.roleEnum.ADMIN]), user_service_1.default.freezeAccount);
router.delete("/:userId/freeze-account", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.ACCESS, [user_model_1.roleEnum.ADMIN]), user_service_1.default.freezeAccount);
router.patch("/cover-image", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.REFRESH, []), (0, cloud_multer_1.cloudFileUplaod)({
    validation: cloud_multer_1.validationFile.images,
    storageApproch: cloud_multer_1.StorageEnum.MEMORY,
    maxSizeMB: 6
}).array("attachments", 5), user_service_1.default.coverImages);
exports.default = router;
