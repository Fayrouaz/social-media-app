"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3_config_1 = require("../../Utils/multer/s3.config");
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../../DB/models/user.model");
class UserService {
    _userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    constructor() { }
    getProfile = async (req, res) => {
        await req.user?.populate("friends");
        return res.status(200).json({
            message: "Done",
            data: {
                user: req.user,
                decode: req.decode
            }
        });
    };
    profileImage = async (req, res) => {
        const { ContentType, originalname, } = req.body;
        const { url, Key } = await (0, s3_config_1.createRresingnedURL)({
            ContentType: ContentType,
            originalname: originalname,
            path: `users/${req.decode?._id}`
        });
        await this._userModel.updateOne({ filter: { _id: req.decode?._id }, update: {
                profileImage: Key
            } });
        return res.status(200).json({
            message: "Done🎉🎉",
            url,
            Key
        });
    };
    coverImages = async (req, res) => {
        const urls = await (0, s3_config_1.uploadFiles)({
            files: req.files,
            path: `users/${req.decode?._id}/cover`
        });
        return res.status(200).json({
            message: "Done🎉🎉",
            urls
        });
    };
    userRepo = new user_repositry_1.UserRepository(user_model_1.UserModel);
    freezeAccount = async (req, res, next) => {
        try {
            const currentUser = req.decode;
            if (!currentUser)
                return next(new Error("Unauthorized"));
            const { userId } = req.params;
            const requesterId = currentUser._id;
            const requesterRole = currentUser.role;
            if (userId && requesterRole !== user_model_1.roleEnum.ADMIN) {
                return next(new Error("You are not authorized to freeze this account"));
            }
            const targetUserId = userId
                ? new mongoose_1.Types.ObjectId(userId)
                : requesterId;
            const updatedUser = this._userModel.findOneAndUpdate({
                filter: { _id: targetUserId, frozenAt: null },
                update: { frozenAt: new Date(), frozenBy: requesterId },
                options: { new: true }
            });
            if (!updatedUser) {
                return next(new Error("Account already frozen or not found"));
            }
            return res.status(200).json({
                message: "Account frozen successfully ❄️",
                data: { user: updatedUser }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = new UserService();
