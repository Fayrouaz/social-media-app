
import {Request , Response} from "express"
import { IConfirmEmailDTO, ILoginDTO, ISignupDTO } from "./auth.dto";
import {  IUser, UserModel } from "../../DB/models/user.model";

import { BadRequestExpetion, ConflictExpetion, NotFoundExpetion, UnothorizedtExpetion } from "../../Utils/response/error.response";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import { Model } from "mongoose";
import { compareHash, generateHash } from "../../Utils/security/hash";
import { generateOtp } from "../../Utils/security/generateOtp";
import { emailEvents } from "../../Utils/events/event.email";
import { createLoginCreditionals} from "../../Utils/security/token";
import { TokenModel } from "../../DB/models/token.model";


class AuthenticiationService{
  private _userModel = new UserRepository(UserModel as Model<IUser>);
 constructor(){}
    signup = async (req : Request ,res:Response ) :Promise<Response >=>{
      const {username ,email ,password} :ISignupDTO = req.body;

        const checkUser = await this._userModel.findOne({
        filter :{email} ,
        select :"email" ,
      });
        if(checkUser) throw new ConflictExpetion("User Already Exists")
           const otp = generateOtp();
           const user = await this._userModel.createUser({data :[{username ,email ,password:await generateHash(password) ,confirmEmailOTP:await generateHash(otp)},]
            ,options :{validateBeforeSave : true}}) 

           await emailEvents.emit("confirmEmail" ,{
             to:email,
             username,
             otp
           })
      
        return res.status(201).json({message : "User Created Succesfully" , user});
    
  }

 login = async (req : Request ,res:Response)=>{
      const {email ,password} :ILoginDTO = req.body ;
      const user = await this._userModel.findOne({
         filter :{email}
      });
       if(!user){throw new NotFoundExpetion("User Not Found")}
       if(!user.confirmedAt) throw new BadRequestExpetion("Verify your Account")
    
       if(!await compareHash(password , user.password)) throw  new BadRequestExpetion("Invalid Passwords😒")

      
        const creditionals = await createLoginCreditionals(user);

     res.status(201).json({message : "User Logged in Successfully🎉" , creditionals});
}
  confirmEmial = async(req:Request , res : Response):Promise<Response> => {
     const {email , otp} : IConfirmEmailDTO= req.body;
      const  user = await this._userModel.findOne({filter : {email , confirmEmailOTP:{$exists : true}, confirmedAt:{$exists:false}}});
     if(!user)  throw new NotFoundExpetion("User Not Found🤷‍♂️");
     if(!compareHash(otp,user?.confirmEmailOTP as string )){
           throw new BadRequestExpetion("Invalid OTP");
     }
     
      await this._userModel.updateOne({filter:{email} , update :
         {
          $set :{confirmedAt : new Date() },
          $unset :{confirmEmailOTP : true} ,  
           otpCreatedAt: new Date()
          }})
       return res.status(201).json({message : "User Confirmed SuccessFully🎉"});


  }
        





logout = async (req: any, res: Response) => {
    const jti = req.decode?.jti; 
    const exp = req.decode?.exp;
    const userId = req.user?._id;

    if (!jti) {
        throw new BadRequestExpetion("Invalid Token: jti is missing");
    }

    const isRevoked = await TokenModel.findOne({ 
        jwtid: jti  
    });

    if (isRevoked) {
        throw new BadRequestExpetion("Token is already revoked ✋");
    }

    await TokenModel.create({
        jwtid: jti,
        userId: userId,
        expireAt: new Date(exp * 1000)
    });

    return res.status(200).json({ 
        message: "Logged out Successfully 🌏" 
    });
}
   





  refreshToken = async (req: Request, res: Response): Promise<Response> => {

    const jti = req.decode?.jti;
    const exp = req.decode?.exp;
    const user = req.user;


    if (!jti || !exp) {
      throw new BadRequestExpetion("Invalid Token: jti or exp is missing from payload");
    }

    if (!user) {
      throw new UnothorizedtExpetion("User context is missing, please login again");
    }

    const isRevoked = await TokenModel.findOne({ jwtid: jti });
    if (isRevoked) {
      throw new BadRequestExpetion("This refresh token has already been used or revoked ✋");
    }


    await TokenModel.create({
      jwtid: jti,
      userId: user._id,
      expireAt: new Date(exp * 1000) 
    });

  
    const creditionals = await createLoginCreditionals(user);

   
    return res.status(200).json({ 
      message: "Token Refreshed Successfully 🔄", 
      creditionals 
    });
  };

}


export  default new AuthenticiationService();