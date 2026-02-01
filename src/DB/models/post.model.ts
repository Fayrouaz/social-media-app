




import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum AllowCommentsEnum {
  ALLOW="ALLOW",
  DENY="DENY"
}

export enum AvalibilityEnum{

 PUBLIC="PUBLIC",
 FRIENDS="FRIENDS",
 ONLYME="ONLYME"
}


export enum LIKEUNLIKEEnum{
 LIKE="LIKE",
 UNLIKE="UNLIKE",
}


export interface IPost{
  content:string;
  attachment:string[];
  allowComments:AllowCommentsEnum ;
  avalibility : AvalibilityEnum;
  assetPostFolderId ?:string;

  tags ?:Types.ObjectId[]

  likes?:Types.ObjectId[]
 createdBy:Types.ObjectId
 freezedBy:Types.ObjectId
 freezedAt?:Date;

 restoredBy:Types.ObjectId
 resotedAt?:Date;

  createdAt: Date;
  updatedAt: Date;
 
}

export type HPostDocument = HydratedDocument<IPost>;
const postSchema = new Schema<IPost>({
 content:{
   type:String,
   minLength:2,
   maxLength:4000,
   required: function(this: IPost) {
    return !this.attachment || this.attachment.length === 0;
  },
      assetPostFolderId :String,
 },
  attachment:[String],
  allowComments:{
    type:String,
    enum:Object.values(AllowCommentsEnum),
    default:AllowCommentsEnum.ALLOW
  },
 avalibility:{
   type:String,
   enum:Object.values(AvalibilityEnum),
   default:AvalibilityEnum.PUBLIC

 },

   likes:[{type:Schema.Types.ObjectId , ref:"User"}],
  tags:[{type:Schema.Types.ObjectId , ref:"User"}],
  createdBy:[{type:Schema.Types.ObjectId,required:true , ref:"User"}],

  freezedBy:{
  type:Schema.Types.ObjectId , ref:"User"
  },
   
   freezedAt : Date,
   restoredBy:{
  type:Schema.Types.ObjectId , ref:"User"

   },
  resotedAt:Date

},{timestamps:true})


export const PostModel = models.Post ||model<IPost>("Post" ,postSchema )