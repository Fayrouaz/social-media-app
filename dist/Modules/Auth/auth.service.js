"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../DB/models/user.model");
const error_response_1 = require("../../Utils/response/error.response");
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
const hash_1 = require("../../Utils/security/hash");
const generateOtp_1 = require("../../Utils/security/generateOtp");
const event_email_1 = require("../../Utils/events/event.email");
const token_1 = require("../../Utils/security/token");
const token_model_1 = require("../../DB/models/token.model");
class AuthenticiationService {
    _userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    constructor() { }
    signup = async (req, res) => {
        const { username, email, password } = req.body;
        const checkUser = await this._userModel.findOne({
            filter: { email },
            select: "email",
        });
        if (checkUser)
            throw new error_response_1.ConflictExpetion("User Already Exists");
        const otp = (0, generateOtp_1.generateOtp)();
        const user = await this._userModel.createUser({ data: [{ username, email, password, confirmEmailOTP: `${otp}` },],
            options: { validateBeforeSave: true } });
        await event_email_1.emailEvents.emit("confirmEmail", {
            to: email,
            username,
            otp
        });
        return res.status(201).json({ message: "User Created Succesfully", user });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this._userModel.findOne({
            filter: { email }
        });
        if (!user) {
            throw new error_response_1.NotFoundExpetion("User Not Found");
        }
        if (!user.confirmedAt)
            throw new error_response_1.BadRequestExpetion("Verify your Account");
        if (!await (0, hash_1.compareHash)(password, user.password))
            throw new error_response_1.BadRequestExpetion("Invalid Passwords😒");
        const creditionals = await (0, token_1.createLoginCreditionals)(user);
        res.status(201).json({ message: "User Logged in Successfully🎉", creditionals });
    };
    confirmEmial = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this._userModel.findOne({ filter: { email, confirmEmailOTP: { $exists: true }, confirmedAt: { $exists: false } } });
        if (!user)
            throw new error_response_1.NotFoundExpetion("User Not Found🤷‍♂️");
        if (!(0, hash_1.compareHash)(otp, user?.confirmEmailOTP)) {
            throw new error_response_1.BadRequestExpetion("Invalid OTP");
        }
        await this._userModel.updateOne({ filter: { email }, update: {
                $set: { confirmedAt: new Date() },
                $unset: { confirmEmailOTP: true },
                otpCreatedAt: new Date()
            } });
        return res.status(201).json({ message: "User Confirmed SuccessFully🎉" });
    };
    logout = async (req, res) => {
        const jti = req.decode?.jti;
        const exp = req.decode?.exp;
        const userId = req.user?._id;
        if (!jti) {
            throw new error_response_1.BadRequestExpetion("Invalid Token: jti is missing");
        }
        const isRevoked = await token_model_1.TokenModel.findOne({
            jwtid: jti
        });
        if (isRevoked) {
            throw new error_response_1.BadRequestExpetion("Token is already revoked ✋");
        }
        await token_model_1.TokenModel.create({
            jwtid: jti,
            userId: userId,
            expireAt: new Date(exp * 1000)
        });
        return res.status(200).json({
            message: "Logged out Successfully 🌏"
        });
    };
    refreshToken = async (req, res) => {
        const jti = req.decode?.jti;
        const exp = req.decode?.exp;
        const user = req.user;
        if (!jti || !exp) {
            throw new error_response_1.BadRequestExpetion("Invalid Token: jti or exp is missing from payload");
        }
        if (!user) {
            throw new error_response_1.UnothorizedtExpetion("User context is missing, please login again");
        }
        const isRevoked = await token_model_1.TokenModel.findOne({ jwtid: jti });
        if (isRevoked) {
            throw new error_response_1.BadRequestExpetion("This refresh token has already been used or revoked ✋");
        }
        await token_model_1.TokenModel.create({
            jwtid: jti,
            userId: user._id,
            expireAt: new Date(exp * 1000)
        });
        const creditionals = await (0, token_1.createLoginCreditionals)(user);
        return res.status(200).json({
            message: "Token Refreshed Successfully 🔄",
            creditionals
        });
    };
}
exports.default = new AuthenticiationService();
