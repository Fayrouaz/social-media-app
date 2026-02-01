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
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(30, { message: "Username must be at most 30 characters long" }),
    
    email: z.string().email({ message: "Invalid email address" }),
    
    password: z.string(),
    
    confirmPassword: z.string(),
    
    otp: z.string().regex(/^\d{5,7}$/), 

    file: function(mimetype: string[] = []) {
        return z.strictObject({
            fieldname: z.string(),
            originalname: z.string(),
            encoding: z.string(),
            mimetype: z.enum(mimetype as [string, ...string[]]),
            buffer: z.any().optional(),
            path: z.string().optional(),
            size: z.number(),
        }).refine((data) => data.path || data.buffer, {
            message: "Please provide a file",
        });
    },


    id: z.string().refine((val) => val.length === 24, { message: "Invalid ID" })
};