"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        minLength: 2,
        maxLength: 4000,
        required: function () {
            return !this.attachment || this.attachment.length === 0;
        },
    },
    attachment: [String],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdBy: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    postId: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    commentId: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }],
    freezedBy: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Post"
    },
    freezedAt: Date,
    restoredBy: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "User"
    },
    resotedAt: Date
}, { timestamps: true });
commentSchema.pre(["find", "findOne", "findOneAndUpdate", "updateOne"], async function () {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
});
exports.CommentModel = mongoose_1.models.Comment || (0, mongoose_1.model)("Comment", commentSchema);
