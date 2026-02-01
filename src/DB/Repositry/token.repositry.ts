

// src/DB/repository/token.repository.ts
import { Model, Types } from "mongoose";
import { IToken } from "../models/token.model";

export class TokenRepository {
  constructor(private readonly tokenModel: Model<IToken>) {}

  create = async (data: {
    jwtid: string;
    userId: Types.ObjectId;
    expireAt: Date;
  }): Promise<IToken> => {
    return await this.tokenModel.create(data);
  };

  findByJwtId = async (jwtid: string): Promise<IToken | null> => {
    return await this.tokenModel.findOne({ jwtid });
  };

 
  deleteByJwtId = async (jwtid: string): Promise<void> => {
    await this.tokenModel.deleteOne({ jwtid });
  };

 
  deleteAllUserTokens = async (
    userId: Types.ObjectId
  ): Promise<void> => {
    await this.tokenModel.deleteMany({ userId });
  };
}
