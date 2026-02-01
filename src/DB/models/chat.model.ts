







import { HydratedDocument, model, models, Schema, Types} from "mongoose";


export interface IMessage{
   content:string;
   createdBy:Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
 
}

export interface IChat{
  participants:Types.ObjectId[];
  message : IMessage[];
  group?:string;
  group_image?:string;
  roomId ?:string;
  createdBy:Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
 
}
export type HChatDocument = HydratedDocument<IChat>;

export type HMessageDocument = HydratedDocument<IMessage>;

const messageSchema = new Schema<IMessage>({
  content:{
    type:String,
    required:true,
    maxLength:5000000,
    minLength:2,
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"User",
     
  }

},{timestamps:true})


const chatSchema = new Schema<IChat>({
participants:[{
   type:Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },],
  createdBy:{
   type:Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
   group:String,
   group_image:String,
   roomId:{
    type:String,
   
    },
    message:[messageSchema]

},{timestamps:true})


export const ChatModel = models.Chat ||model<IChat>("Chat" ,chatSchema )