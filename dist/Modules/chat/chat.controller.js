"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../../Middleware/authentication.middleware");
const chat_authoriztion_1 = require("./chat.authoriztion");
const token_1 = require("../../Utils/security/token");
const validation_middleware_1 = require("../../Middleware/validation.middleware");
const chat_validation_1 = require("./chat.validation");
const chat_service_1 = __importDefault(require("./chat.service"));
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", (0, authentication_middleware_1.authentication)(token_1.tokenTypeEnum.ACCESS, chat_authoriztion_1.endpoint.getChat), (0, validation_middleware_1.validation)(chat_validation_1.getChatSchema), chat_service_1.default.getChat);
exports.default = router;
