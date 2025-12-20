import { NextFunction , Request ,Response } from "express";
import {  roleEnum } from "../DB/models/user.model";
import { decodedToken, tokenTypeEnum } from "../Utils/security/token";
import { BadRequestExpetion, ForbiddedExpetion } from "../Utils/response/error.response";







export const authentication =  ({tokenType = tokenTypeEnum.ACCESS , accessRoles}:{tokenType:tokenTypeEnum ,accessRoles:roleEnum[]})=>{

  return  async(req:Request ,res:Response ,next:NextFunction)=>{
     if(!req.headers.authorization) throw new BadRequestExpetion("Missing Authorization headers");
  
   const {decode , user} =await decodedToken({authorizition :req.headers.authorization , tokenType})
    if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
       throw new ForbiddedExpetion("You Are Not Authorized to access this route");
    }
   //if(!accessRoles.includes(user.role)) throw new ForbiddedExpetion("You Are Not Authorized to access this route")

    req.decode = decode ;
    req.user = user;
     return next();
 
}

 
}