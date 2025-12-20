


import { Schema, model, Types, Document } from 'mongoose';

export interface IToken extends Document {
    jwtid: string;
    userId: Types.ObjectId;
    expireAt: Date;
}

const tokenSchema = new Schema<IToken>({
  jwtid: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expireAt: { type: Date, required: true }
});


tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const TokenModel = model<IToken>('Token', tokenSchema);