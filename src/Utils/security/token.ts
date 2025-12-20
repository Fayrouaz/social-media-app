

import {sign , verify , Secret, SignOptions, JwtPayload} from "jsonwebtoken" ;
import { HUserDocument, IUser, roleEnum, UserModel } from "../../DB/models/user.model";
import {v4 as uuid} from "uuid" ;
import { NotFoundExpetion, UnothorizedtExpetion } from "../response/error.response";

import { UserRepository } from "../../DB/Repositry/user.repositry";
import { Model } from "mongoose";
export enum SignatureLevelEnum {
USER = "USER",
ADMIN = "ADMIN"

}


export enum tokenTypeEnum {
ACCESS = "ACCESS",
REFRESH= "REFRESH"

}

export const generateToken = async({payload , secret , options} : {payload:object ; secret :Secret ; options:SignOptions})
:Promise<string>=>{

   return await sign(payload , secret , options);
}


export const verifyToken = async({token , secret } : {token:string; secret :Secret })
:Promise<JwtPayload>=>{

   return await verify(token , secret) as JwtPayload ;
}


export const getSignatureLevel = async(role:roleEnum = roleEnum.USER) =>{
   let signatureLevel :SignatureLevelEnum = SignatureLevelEnum.USER;

     switch(role){
      case roleEnum.ADMIN :
       signatureLevel = SignatureLevelEnum.ADMIN ;
       break;
     case roleEnum.USER:
       signatureLevel = SignatureLevelEnum.USER;
       break;
       default:
       break;

      
     }
  return signatureLevel;

}



export const getSignature = async( signatureLevel :SignatureLevelEnum = SignatureLevelEnum.USER) :
 Promise<{access_token :string  ;access_refresh :string}>=>{

  let signatures: {access_token :string , access_refresh :string}= {access_token :"" , access_refresh :""}
   switch(signatureLevel){
     case   SignatureLevelEnum.ADMIN:
       signatures.access_token = process.env.ACCESS_ADMIN_TOKEN_SECRET as string
       signatures.access_refresh =process.env.REFRESH_ADMIN_TOKEN_SECRET as string
        break;
      case   SignatureLevelEnum.USER:
       signatures.access_token = process.env.ACCESS_USER_TOKEN_SECRET as string
       signatures.access_refresh =process.env.REFRESH_USER_TOKEN_SECRET as string
        
       default: 
        break;

   }

    return signatures ; 
}



// export const createLoginCreditionals = async(user:HUserDocument): Promise<{access_token :string  ;access_refresh :string}> =>{

//   const signatureLevel = await getSignatureLevel(user.role);
//   const signatures = await getSignature(signatureLevel);
//        const jwtid = uuid();
//       const access_token = await generateToken({ payload : {_id : user._id} , secret :signatures.access_token, options:{expiresIn:Number(process.env.ACCESS_EXPIRES_IN) , jwtid}})
      
//      const access_refresh = await generateToken({ payload : {_id : user._id} , secret :signatures.access_refresh , options:{expiresIn:Number(process.env.REFRESH_EXPIRES_IN)}})

//   return {access_token,  access_refresh}

// }



export const createLoginCreditionals = async(user:HUserDocument): Promise<{access_token :string ;access_refresh :string}> =>{

  const signatureLevel = await getSignatureLevel(user.role);
  const signatures = await getSignature(signatureLevel);
  
  const jwtid = uuid();


  const access_token = await generateToken({ 
    payload : {_id : user._id}, 
    secret : signatures.access_token, 
    options: { expiresIn: Number(process.env.ACCESS_EXPIRES_IN), jwtid }
  });
      

  const access_refresh = await generateToken({ 
    payload : {_id : user._id}, 
    secret : signatures.access_refresh, 
    options: { expiresIn: Number(process.env.REFRESH_EXPIRES_IN), jwtid }
  });

  return { access_token, access_refresh };
}


export const decodedToken = async({authorizition ,tokenType = tokenTypeEnum.ACCESS}:{authorizition:string , tokenType?:tokenTypeEnum}) =>{
    const userModel = new UserRepository(UserModel as Model<IUser> );
  const [bearer , token] = authorizition.split(" ") ;
   if(!token || !bearer)  throw new UnothorizedtExpetion("Missing Token Parts👨‍🦯");

   const signatures = await getSignature(bearer as SignatureLevelEnum);
    console.log("Checking Token for:", tokenType);
console.log("Secret used:", tokenType === tokenTypeEnum.REFRESH ? "Using Refresh Secret" : "Using Access Secret");
  const decode = await verifyToken({token , secret:tokenType === tokenTypeEnum.REFRESH ?signatures.access_refresh : signatures.access_token })

   if(!decode ?._id || !decode.iat) throw new   UnothorizedtExpetion("Invalid Token Payload")

 

  const user = await userModel.findById({id :{_id : decode._id}})

  if(!user) throw new NotFoundExpetion("User Not Found");

  return {user ,decode}

}



