"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const mongoose_1 = require("mongoose");
const chat_model_1 = require("../../DB/models/chat.model");
const user_model_1 = require("../../DB/models/user.model");
const chat_repositry_1 = require("../../DB/Repositry/chat.repositry");
const user_repositry_1 = require("../../DB/Repositry/user.repositry");
const error_response_1 = require("../../Utils/response/error.response");
class ChatService {
    _chatModel = new chat_repositry_1.chatRepositry(chat_model_1.ChatModel);
    _userModel = new user_repositry_1.UserRepository(user_model_1.UserModel);
    constructor() { }
    getChat = async (req, res) => {
        const { userId } = req.params;
        const chat = await this._chatModel.findOne({
            filter: {
                participants: {
                    $all: [req.user?._id, mongoose_1.Types.ObjectId.createFromHexString(userId)]
                },
                group: { $exists: false }
            },
            options: {
                populate: "participants"
            }
        });
        if (!chat) {
            throw new error_response_1.NotFoundExpetion("Fail to find out");
        }
        return res.status(200).json({ message: "Done", data: { chat } });
    };
    sayHi = ({ message, socket, callback, io }) => {
        try {
            console.log(message);
            callback ? callback("I Recirved Message ") : undefined;
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
    sendMessage = async ({ content, socket, sendTo, io }) => {
        try {
            const createdBy = socket.creditionals?.user?._id;
            console.log({ content, sendTo, createdBy });
            const user = await this._userModel.findOne({
                filter: {
                    _id: mongoose_1.Types.ObjectId.createFromHexString(sendTo),
                    friends: { $in: [createdBy] }
                }
            });
            if (!user)
                throw new error_response_1.NotFoundExpetion("User Not Found");
            const chat = await this._chatModel.findOneAndUpdate({
                filter: {
                    participants: {
                        $all: [createdBy, mongoose_1.Types.ObjectId.createFromHexString(sendTo)]
                    },
                    group: { $exists: false }
                },
                update: {
                    $push: {
                        message: {
                            content,
                            createdBy
                        }
                    }
                }
            });
            if (!chat) {
                const [newChat] = (await this._chatModel.create({
                    data: [{
                            createdBy,
                            message: [{ content, createdBy }],
                            participants: [createdBy, mongoose_1.Types.ObjectId.createFromHexString(sendTo)]
                        }]
                })) || [];
                if (!newChat)
                    throw new error_response_1.BadRequestExpetion("Fail to create chat ");
            }
            io.emit("successMessage", { content });
            io.emit("newMessage", { content, from: socket.creditionals?.user });
        }
        catch (error) {
            socket.emit("custom_error", error);
        }
    };
}
exports.ChatService = ChatService;
exports.default = new ChatService();
