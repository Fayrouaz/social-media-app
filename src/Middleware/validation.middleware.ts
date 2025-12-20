import { NextFunction , Request ,Response } from "express"
import { BadRequestExpetion } from "../Utils/response/error.response";
import { ZodError, ZodType } from "zod";
import * as z from "zod" ;
type keyRequType = keyof Request ;
type SchemaType =Partial <Record<keyRequType ,ZodType>>



export const validation = (schema:SchemaType) =>{
   const validationErrors :Array<{key:keyRequType ,issues:Array<{message : string , path : (string |number | symbol)[]}>}> = [];

 return(req:Request ,res:Response ,next:NextFunction) : NextFunction=>{
    for(const key of Object.keys(schema) as  keyRequType[]){
     if(!schema[key]) continue ;

      const validationResults = schema[key].safeParse(req[key]);
      if(!validationResults.success){
         const errors = validationResults.error as ZodError ;
         validationErrors.push({
            key ,
            issues: errors.issues.map((issue) =>{
              return {message : issue.message , path : issue.path}
            })
          })
      }

      if(validationErrors.length > 0){
         throw new BadRequestExpetion("Valdition Error" , {cause : validationErrors})
       }
    }
  return next() as unknown as NextFunction;
}

}


export const generalFields = {
username:z.string({ error: "Username  is required"})
   .min(3, { error: "Username must be at least 3 character long "})
   .max(30, { error: "Username must be at more 30 character long "}),
   email : z.email({error : "Invalid Email Address"}),
   password:z.string(),
  confirmPassword: z.string(),
  confirmEmailOtp : z.string().regex(/^\d{6}$/)

}