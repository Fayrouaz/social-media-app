"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = exports.LIKEUNLIKEEnum = exports.AvalibilityEnum = exports.AllowCommentsEnum = void 0;
const mongoose_1 = require("mongoose");
var AllowCommentsEnum;
(function (AllowCommentsEnum) {
    AllowCommentsEnum["ALLOW"] = "ALLOW";
    AllowCommentsEnum["DENY"] = "DENY";
})(AllowCommentsEnum || (exports.AllowCommentsEnum = AllowCommentsEnum = {}));
var AvalibilityEnum;
(function (AvalibilityEnum) {
    AvalibilityEnum["PUBLIC"] = "PUBLIC";
    AvalibilityEnum["FRIENDS"] = "FRIENDS";
    AvalibilityEnum["ONLYME"] = "ONLYME";
})(AvalibilityEnum || (exports.AvalibilityEnum = AvalibilityEnum = {}));
var LIKEUNLIKEEnum;
(function (LIKEUNLIKEEnum) {
    LIKEUNLIKEEnum["LIKE"] = "LIKE";
    LIKEUNLIKEEnum["UNLIKE"] = "UNLIKE";
})(LIKEUNLIKEEnum || (exports.LIKEUNLIKEEnum = LIKEUNLIKEEnum = {}));
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        minLength: 2,
        maxLength: 4000,
        required: function () {
            return !this.attachment || this.attachment.length === 0;
        },
        assetPostFolderId: String,
    },
    attachment: [String],
    allowComments: {
        type: String,
        enum: Object.values(AllowCommentsEnum),
        default: AllowCommentsEnum.ALLOW
    },
    avalibility: {
        type: String,
        enum: Object.values(AvalibilityEnum),
        default: AvalibilityEnum.PUBLIC
    },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdBy: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    freezedBy: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User"
    },
    freezedAt: Date,
    restoredBy: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User"
    },
    resotedAt: Date
}, { timestamps: true });
exports.PostModel = mongoose_1.models.Post || (0, mongoose_1.model)("Post", postSchema);
