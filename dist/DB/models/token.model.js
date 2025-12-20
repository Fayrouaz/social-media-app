"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    jwtid: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    expireAt: { type: Date, required: true }
});
tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
exports.TokenModel = (0, mongoose_1.model)('Token', tokenSchema);
