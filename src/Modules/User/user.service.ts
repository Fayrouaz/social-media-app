
import { Request, Response } from "express";
import { uploadFiles, uploadLargeFile } from "../../Utils/multer/s3.config";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import { Model } from "mongoose";
import { IUser, UserModel } from "../../DB/models/user.model";

class UserService {
  private _userModel = new UserRepository(UserModel as Model<IUser>);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {

    return res.status(200).json({
      message: "Done",
      data: { 
        user:  req.user, 
        decode:req.decode 
      }
    });
  }

profileImage= async (req: Request, res: Response): Promise<Response> => {

   //const Key = await uploadFile({path:`users/${req.decode?._id}` , file:req.file as Express.Multer.File})
    const Key= await  uploadLargeFile({path:`users/${req.decode?._id}` , file:req.file as Express.Multer.File})

    await this._userModel.updateOne({filter:{_id:req.decode?._id} , update:{
          profileImage :Key
     }})
   
    return res.status(200).json({ 
      message: "Done🎉🎉", 
      
    });
  };


coverImages = async (req: Request, res: Response): Promise<Response> => {

   const urls = await uploadFiles({
      files:req.files as Express.Multer.File[],
      path:`users/${req.decode?._id}/cover`
    })


    return res.status(200).json({ 
      message: "Done🎉🎉", 
      urls
    });
  };


 }







export default new UserService();