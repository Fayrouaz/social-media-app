



import { HydratedDocument, model, models, Schema, Types } from "mongoose";



export interface IComment{
  content:string;
  attachment:string[];


  tags ?:Types.ObjectId[]
  postId:Types.ObjectId
  commentId ?: Types.ObjectId
  likes?:Types.ObjectId[]
 createdBy:Types.ObjectId
 freezedBy:Types.ObjectId
 freezedAt?:Date;

 restoredBy:Types.ObjectId
 resotedAt?:Date;

  createdAt: Date;
  updatedAt: Date;
 
}

export type HCommentDocument = HydratedDocument<IComment>;
const commentSchema = new Schema<IComment>({
 content:{
   type:String,
   minLength:2,
   maxLength:4000,
   required: function(this: IComment) {
    return !this.attachment || this.attachment.length === 0;
  },
 },
  attachment:[String],

 

   likes:[{type:Schema.Types.ObjectId , ref:"User"}],
  tags:[{type:Schema.Types.ObjectId , ref:"User"}],
  createdBy:[{type:Schema.Types.ObjectId,required:true , ref:"User"}],
  postId:[{type:Schema.Types.ObjectId,required:true , ref:"User"}],
  commentId:[{type:Schema.Types.ObjectId,required:true , ref:"User"}],

  freezedBy:{
  type:Schema.Types.ObjectId , ref:"Post"
  },
   
   freezedAt : Date,
   restoredBy:{
  type:Schema.Types.ObjectId , ref:"User"

   },
  resotedAt:Date

},{timestamps:true})
commentSchema.pre(
  ["find", "findOne", "findOneAndUpdate", "updateOne"],
  async function () {
    const query = this.getQuery();
    if (query.paranoid === false) {
      this.setQuery({ ...query });
    } else {
      this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
  }
);



export const CommentModel = models.Comment ||model<IComment>("Comment" ,commentSchema )