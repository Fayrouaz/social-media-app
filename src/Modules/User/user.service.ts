
import { NextFunction, Request, Response } from "express";
import { createRresingnedURL, uploadFiles } from "../../Utils/multer/s3.config";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import { Model, Types } from "mongoose";
import { IUser, roleEnum, UserModel } from "../../DB/models/user.model";
//import path from "path/posix";

class UserService {
  private _userModel = new UserRepository(UserModel as Model<IUser>);

  constructor() {}

  getProfile = async (req: Request, res: Response): Promise<Response> => {
     await req.user?.populate("friends")
    return res.status(200).json({
      message: "Done",
      data: { 
        user:  req.user, 
        decode:req.decode 
      }
    });
  }




profileImage= async (req: Request, res: Response): Promise<Response> => {

   const { ContentType, originalname,}:{ ContentType:string;originalname:string,}= req.body;
   const {url,Key} = await  createRresingnedURL({
     ContentType: ContentType,
      originalname:originalname,
      path:`users/${req.decode?._id}`
    })

    await this._userModel.updateOne({filter:{_id:req.decode?._id} , update:{
          profileImage :Key
     }})
   
    return res.status(200).json({ 
      message: "Done🎉🎉", 
      url,
      Key
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

  userRepo = new UserRepository(UserModel as Model<IUser>);

//  freezeAccount = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   try {
//     // لازم يكون فيه user info من auth middleware
//     const currentUser = req.decode; // فرضًا decoded token
//     if (!currentUser) return next(new Error("Unauthorized"));

//     const { userId } = req.params;
//     const requesterId = currentUser._id;
//     const requesterRole = currentUser.role;

//     // USER عادي يجمّد نفسه فقط
//     if (userId && requesterRole !== roleEnum.ADMIN) {
//       return next(new Error("You are not authorized to freeze this account"));
//     }

//     // تحويل string لـ ObjectId لو userId موجود
//     const targetUserId: Types.ObjectId = userId
//       ? new Types.ObjectId(userId)
//       : requesterId;

//     // تحديث الحساب
//     const updatedUser: IUser | null = await this.userRepo.findOneAndUpdate({
//       filter: { _id: targetUserId, frozenAt: null },
//       update: { frozenAt: new Date(), frozenBy: requesterId },
//       options: { new: true }
//     });

//     if (!updatedUser) {
//       return next(new Error("Account already frozen or not found"));
//     }

//     return res.status(200).json({
//       message: "Account frozen successfully ❄️",
//       data: { user: updatedUser }
//     });

//   } catch (error) {
//     next(error);
//   }


// }


  freezeAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const currentUser = req.decode;
      if (!currentUser) return next(new Error("Unauthorized"));

      const { userId } = req.params;
      const requesterId: Types.ObjectId = currentUser._id;
      const requesterRole = currentUser.role;

      // USER عادي يجمّد نفسه فقط
      if (userId && requesterRole !== roleEnum.ADMIN) {
        return next(new Error("You are not authorized to freeze this account"));
      }

      // تحويل string إلى ObjectId لو موجود
      const targetUserId: Types.ObjectId = userId
        ? new Types.ObjectId(userId)
        : requesterId;

      // تحديث الحساب باستخدام Repository
      const updatedUser = this._userModel.findOneAndUpdate({
        filter: { _id: targetUserId, frozenAt: null },
        update: { frozenAt: new Date(), frozenBy: requesterId },
        options: { new: true }
      }) as unknown as IUser | null; // 🟢 Type assertion للتوافق مع TypeScript

      if (!updatedUser) {
        return next(new Error("Account already frozen or not found"));
      }

      return res.status(200).json({
        message: "Account frozen successfully ❄️",
        data: { user: updatedUser }
      });

    } catch (error) {
      next(error);
    }
  };
}




export default new UserService();