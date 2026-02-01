import { Request, Response } from "express";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import {  IUser, UserModel } from "../../DB/models/user.model";
import { Model, UpdateQuery } from "mongoose";
import { AvalibilityEnum, IPost, LIKEUNLIKEEnum, PostModel } from "../../DB/models/post.model";
import { postRepositry } from "../../DB/Repositry/post.repositry";
import { BadRequestExpetion, NotFoundExpetion } from "../../Utils/response/error.response";
import { uploadFiles } from "../../Utils/multer/s3.config";
import {v4 as uuid }  from "uuid";

// export const postAvalibility = async (req: Request) => { const { postId } = req.params as unknown as { postId: string }; const _postModel = new postRepositry(PostModel as Model<IPost>); const post = await _postModel.findById(postId); if (!post) throw new NotFoundExpetion("Post Does Not Exist"); return post.avalibility; };




export const postAvalibility = async (req: Request) => {
  const { postId } = req.params as unknown as { postId: string };

  
  const _postModel = new postRepositry(PostModel as Model<IPost>);

  const post = await _postModel.findById({
    id: postId as any, 
  });

  if (!post) {
    throw new NotFoundExpetion("Post Does Not Exist");
  }

  return post.avalibility;
};


class PostService {
 constructor(){}

  private _userModel = new UserRepository(UserModel as Model<IUser>);
  private _postModel = new postRepositry(PostModel as Model<IPost>);


  createPost = async (req: Request, res: Response) => {


    if (req.body.tags?.length && (await this._userModel.find({ filter: { _id: { $in: req.body.tags } } })).length !== req.body.tags.length) {

      throw new NotFoundExpetion("Some mentioned user not exists")
    }

  let attachments:string[] = [];
  let assetFolder = undefined;
  if(req.files?.length){
  let assetPostFolderId = uuid();

   attachments = await uploadFiles({
    files: req.files as Express.Multer.File[],
    path:`users/${req.user?._id}/post/${assetPostFolderId}`
   })
   assetFolder = assetPostFolderId;
  }

  const [post] = await this._postModel.create({
      data:[{
       ...req.body,
       attachments,
       assetPostFolderId:assetFolder,
       createdBy:req.user?._id
       }]
  })|| [];

  if(!post){throw new BadRequestExpetion("fail to create post ")};
  return res.status(201).json({message : "created sussefully" , post})




}




likePost = async (req: Request, res: Response) => {
    
    const { postId } = req.params as unknown as { postId: string };
    const { action } = req.query as unknown as { action: string }; 
    

    let update: UpdateQuery<any> = {
      $addToSet: { likes: req.user?._id }
    };

    if (action === LIKEUNLIKEEnum.UNLIKE) {
        update = { $pull: { likes: req.user?._id } };
    }

    const post = await this._postModel.findOneAndUpdate({
        filter: { _id: postId, avalibility: AvalibilityEnum.PUBLIC },
        update
    });

    if (!post) throw new NotFoundExpetion("Post Does Not Exist");
    
   
    return res.status(200).json({ message: "Done", post });
  }


 getAllPosts=async(req:Request , res:Response)=>{
  let {page,size} = req.query as unknown as {page:number;size:number}
  const posts = await this._postModel.paginate({
    filter:{avalibility:AvalibilityEnum.PUBLIC},
    page , size
  })
   return res.status(200).json({message:"Posts Fectched Successfully" , posts})
 }

}


export default new  PostService();