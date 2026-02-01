"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
const user_model_1 = require("../../DB/models/user.model");
const post_model_1 = require("../../DB/models/post.model");
const post_repositry_1 = require("../../DB/Repositry/post.repositry");
const comment_repositry_1 = require("../../DB/Repositry/comment.repositry");
const comment_model_1 = require("../../DB/models/comment.model");
const post_service_1 = require("../Post/post.service");
const error_response_1 = require("../../Utils/response/error.response");
const s3_config_1 = require("../../Utils/multer/s3.config");
class commentService {
    _userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    _postModel = new post_repositry_1.postRepositry(post_model_1.PostModel);
    _commentModel = new comment_repositry_1.commentRepositry(comment_model_1.CommentModel);
    constructor() { }
    createComment = async (req, res) => {
        const { postId } = req.params;
        const avalibilityValue = await (0, post_service_1.postAvalibility)(req);
        const post = await this._postModel.findOne({
            filter: {
                _id: postId,
                allowComments: post_model_1.AllowCommentsEnum.ALLOW,
                $or: [{ avalibility: avalibilityValue }]
            }
        });
        if (!post)
            throw new error_response_1.NotFoundExpetion("Fail to Match Results");
        if (req.body.tags?.length && (await this._userModel.find({ filter: { _id: { $in: req.body.tags } } })).length !== req.body.tags.length) {
            throw new error_response_1.NotFoundExpetion("Some mentioned user not exists");
        }
        let attachments = [];
        if (req.files?.length) {
            attachments = await (0, s3_config_1.uploadFiles)({
                files: req.files,
                path: `users/${post.createdBy}/post/${post.assetPostFolderId}`
            });
        }
        const [comment] = await this._commentModel.create({
            data: [{
                    ...req.body,
                    attachments,
                    postId,
                    createdBy: req.user?._id
                }]
        }) || [];
        if (!comment) {
            throw new error_response_1.BadRequestExpetion("fail to create Comment");
        }
        ;
        return res.status(201).json({ message: "Comment Created Successfully" });
    };
}
exports.default = new commentService();
