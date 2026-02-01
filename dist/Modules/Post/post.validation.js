"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeSchema = exports.createPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const validation_middleware_1 = require("../../Middleware/validation.middleware");
const cloud_multer_1 = require("../../Utils/multer/cloud.multer");
const post_model_1 = require("../../DB/models/post.model");
exports.createPostSchema = {
    body: zod_1.default.strictObject({
        content: zod_1.default.string().min(2).max(4000).optional(),
        attachment: zod_1.default.array(validation_middleware_1.generalFields.file(cloud_multer_1.validationFile.images)).max(3).optional(),
        allowComments: zod_1.default.enum(post_model_1.AllowCommentsEnum).default(post_model_1.AllowCommentsEnum.ALLOW),
        avalibility: zod_1.default.enum(post_model_1.AvalibilityEnum).default(post_model_1.AvalibilityEnum.PUBLIC),
        likes: zod_1.default.array(validation_middleware_1.generalFields.id),
        tags: zod_1.default.array(validation_middleware_1.generalFields.id).max(20)
    }).superRefine((data, ctx) => {
        if (!data.attachment?.length && !data.content) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "Please provide Attchment or content"
            });
        }
        if (data.attachment?.length && data.tags.length !== [...new Set(data.tags)].length) {
            ctx.addIssue({
                code: "custom",
                path: ["tags"],
                message: "Please provide Unique Tags"
            });
        }
    })
};
exports.LikeSchema = {
    params: zod_1.default.strictObject({
        postId: validation_middleware_1.generalFields.id,
    }),
    query: zod_1.default.strictObject({
        action: zod_1.default.enum([post_model_1.LIKEUNLIKEEnum.LIKE, post_model_1.LIKEUNLIKEEnum.UNLIKE]).default(post_model_1.LIKEUNLIKEEnum.LIKE)
    }),
    body: zod_1.default.object({}).optional()
};
