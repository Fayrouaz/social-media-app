"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.intialize = void 0;
const socket_io_1 = require("socket.io");
const token_1 = require("../../Utils/security/token");
const chat_gateway_1 = require("../chat/chat.gateway");
let io = null;
const intialize = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        }
    });
    const connectedSockets = new Map();
    io.use(async (socket, next) => {
        try {
            const authHeader = socket.handshake?.auth?.authorization;
            if (!authHeader) {
                return next(new Error("No token provided"));
            }
            const { user, decode } = await token_1.decodedToken({
                authorizition: authHeader,
                tokenType: token_1.tokenTypeEnum.ACCESS
            });
            socket.creditionals = { user, decode };
            socket.data.userId = user._id.toString();
            const userTabs = connectedSockets.get(user._id.toString()) || [];
            userTabs.push(socket.id);
            const userId = user?._id?.toString();
            if (userId) {
                connectedSockets.set(userId, userTabs);
            }
            next();
        }
        catch (error) {
            console.error("Socket Middleware Error:", error.message);
            next(new Error("Authentication failed"));
        }
    });
    const chatGateWay = new chat_gateway_1.ChatGateWay();
    io.on("connection", (socket) => {
        console.log(connectedSockets);
        const userId = socket.creditionals?.user?._id?.toString();
        if (userId) {
            console.log("✅ User ID Connected:", userId);
            socket.join(userId);
        }
        else {
            console.log("❌ Failed to get ID. Full User object:", socket.creditionals?.user);
        }
        console.log("User Channel:", socket.id);
        chatGateWay.register(socket, (0, exports.getIo)());
        socket.on("disconnect", () => {
            const userId = socket.data.userId;
            if (!userId)
                return;
            const remainingTabs = connectedSockets.get(userId)?.filter(tab => tab !== socket.id) || [];
            if (remainingTabs.length) {
                connectedSockets.set(userId, remainingTabs);
            }
            else {
                connectedSockets.delete(userId);
            }
            console.log(`After Delete:: ${connectedSockets.get(userId)}`);
            console.log(connectedSockets);
        });
    });
};
exports.intialize = intialize;
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIo = getIo;
