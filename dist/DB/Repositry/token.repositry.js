"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
class TokenRepository {
    tokenModel;
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    create = async (data) => {
        return await this.tokenModel.create(data);
    };
    findByJwtId = async (jwtid) => {
        return await this.tokenModel.findOne({ jwtid });
    };
    deleteByJwtId = async (jwtid) => {
        await this.tokenModel.deleteOne({ jwtid });
    };
    deleteAllUserTokens = async (userId) => {
        await this.tokenModel.deleteMany({ userId });
    };
}
exports.TokenRepository = TokenRepository;
