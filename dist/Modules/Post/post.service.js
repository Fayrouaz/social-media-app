"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAvalibility = void 0;
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
const user_model_1 = require("../../DB/models/user.model");
const post_model_1 = require("../../DB/models/post.model");
const post_repositry_1 = require("../../DB/Repositry/post.repositry");
const error_response_1 = require("../../Utils/response/error.response");
const s3_config_1 = require("../../Utils/multer/s3.config");
const uuid_1 = require("uuid");
const postAvalibility = async (req) => {
    const { postId } = req.params;
    const _postModel = new post_repositry_1.postRepositry(post_model_1.PostModel);
    const post = await _postModel.findById({
        id: postId,
    });
    if (!post) {
        throw new error_response_1.NotFoundExpetion("Post Does Not Exist");
    }
    return post.avalibility;
};
exports.postAvalibility = postAvalibility;
class PostService {
    constructor() { }
    _userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    _postModel = new post_repositry_1.postRepositry(post_model_1.PostModel);
    createPost = async (req, res) => {
        if (req.body.tags?.length && (await this._userModel.find({ filter: { _id: { $in: req.body.tags } } })).length !== req.body.tags.length) {
            throw new error_response_1.NotFoundExpetion("Some mentioned user not exists");
        }
        let attachments = [];
        let assetFolder = undefined;
        if (req.files?.length) {
            let assetPostFolderId = (0, uuid_1.v4)();
            attachments = await (0, s3_config_1.uploadFiles)({
                files: req.files,
                path: `users/${req.user?._id}/post/${assetPostFolderId}`
            });
            assetFolder = assetPostFolderId;
        }
        const [post] = await this._postModel.create({
            data: [{
                    ...req.body,
                    attachments,
                    assetPostFolderId: assetFolder,
                    createdBy: req.user?._id
                }]
        }) || [];
        if (!post) {
            throw new error_response_1.BadRequestExpetion("fail to create post ");
        }
        ;
        return res.status(201).json({ message: "created sussefully", post });
    };
    likePost = async (req, res) => {
        const { postId } = req.params;
        const { action } = req.query;
        let update = {
            $addToSet: { likes: req.user?._id }
        };
        if (action === post_model_1.LIKEUNLIKEEnum.UNLIKE) {
            update = { $pull: { likes: req.user?._id } };
        }
        const post = await this._postModel.findOneAndUpdate({
            filter: { _id: postId, avalibility: post_model_1.AvalibilityEnum.PUBLIC },
            update
        });
        if (!post)
            throw new error_response_1.NotFoundExpetion("Post Does Not Exist");
        return res.status(200).json({ message: "Done", post });
    };
    getAllPosts = async (req, res) => {
        let { page, size } = req.query;
        const posts = await this._postModel.paginate({
            filter: { avalibility: post_model_1.AvalibilityEnum.PUBLIC },
            page, size
        });
        return res.status(200).json({ message: "Posts Fectched Successfully", posts });
    };
}
exports.default = new PostService();
