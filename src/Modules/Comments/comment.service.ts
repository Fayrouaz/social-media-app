
import { Request ,Response } from "express";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import {  IUser, UserModel } from "../../DB/models/user.model";
import { Model } from "mongoose";
import { AllowCommentsEnum, IPost , PostModel } from "../../DB/models/post.model";
import { postRepositry } from "../../DB/Repositry/post.repositry";
import { commentRepositry } from "../../DB/Repositry/comment.repositry";
import { CommentModel } from "../../DB/models/comment.model";
import { postAvalibility } from "../Post/post.service";
import { BadRequestExpetion, NotFoundExpetion } from "../../Utils/response/error.response";
import { uploadFiles } from "../../Utils/multer/s3.config";




class commentService {

  private _userModel = new UserRepository(UserModel as Model<IUser>);
  private _postModel = new postRepositry(PostModel as Model<IPost>);
  private _commentModel = new commentRepositry(CommentModel);


 constructor(){}


  // createComment = async(req:Request, res:Response) => {
  //    const{postId} = req.params as unknown as (postId:string);
  //    const post = await this._postModel.findOne({
  //      filter:{
  //         _id:postId,
  //        allowComments:AllowCommentsEnum.ALLOW,
  //        $or:postAvalibility(req)
  //     }
  //    })
  //     if(!post) throw new NotFoundExpetion("Fail to Match Results")
  //   return res.status(201).json({message:"Comment Created Successfully"})
  // }


createComment = async (req: Request, res: Response) => {
  const { postId } = req.params as unknown as { postId: string };

  const avalibilityValue = await postAvalibility(req);

  const post = await this._postModel.findOne({
    filter: {
      _id: postId,
      allowComments: AllowCommentsEnum.ALLOW,
      $or: [{ avalibility: avalibilityValue }]
    }
  });

  if (!post) throw new NotFoundExpetion("Fail to Match Results");


    if (req.body.tags?.length && (await this._userModel.find({ filter: { _id: { $in: req.body.tags } } })).length !== req.body.tags.length) {

      throw new NotFoundExpetion("Some mentioned user not exists")
    }

  let attachments:string[] = [];
  if(req.files?.length){

   attachments = await uploadFiles({
    files: req.files as Express.Multer.File[],
    path:`users/${post.createdBy}/post/${post.assetPostFolderId}`
   })
  }

  const [comment] = await this._commentModel.create({
      data:[{
       ...req.body,
       attachments,
       postId ,
       createdBy:req.user?._id
       }]
  })|| [];

  if(!comment){throw new BadRequestExpetion("fail to create Comment")};
  return res.status(201).json({ message: "Comment Created Successfully" });
};




}


export default new commentService();