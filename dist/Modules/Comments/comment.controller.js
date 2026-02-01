"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_service_1 = __importDefault(require("./comment.service"));
const authentication_middleware_1 = require("../../Middleware/authentication.middleware");
const comment_authorization_1 = require("../Comments/comment.authorization");
const token_1 = require("../../Utils/security/token");
const validation_middleware_1 = require("../../Middleware/validation.middleware");
const comment_validation_1 = require("./comment.validation");
const cloud_multer_1 = require("../../Utils/multer/cloud.multer");
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.ACCESS, comment_authorization_1.endpoint.createCoomment), (0, cloud_multer_1.cloudFileUplaod)({ validation: cloud_multer_1.validationFile.images }).array("attachment", 3), (0, validation_middleware_1.validation)(comment_validation_1.createCommentSchema), comment_service_1.default.createComment);
exports.default = router;
