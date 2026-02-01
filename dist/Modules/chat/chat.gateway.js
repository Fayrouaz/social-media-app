"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateWay = void 0;
const chat_events_1 = require("./chat.events");
class ChatGateWay {
    _chatEvent = new chat_events_1.ChatEvents();
    constructor() { }
    register = (socket, io) => {
        this._chatEvent.sayHi(socket, io);
        this._chatEvent.sendMessage(socket, io);
    };
}
exports.ChatGateWay = ChatGateWay;
