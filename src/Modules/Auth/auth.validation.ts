


import * as z from "zod";
import { generalFields } from "../../Middleware/validation.middleware";

export const  loginSchema  = {
 body :z.strictObject({
   email : generalFields.email,
   password : generalFields.password,
  
 })

}

export const  signUpSchema = {
 body :loginSchema.body.extend({
   
   username : generalFields.username ,

   confirmPasword : generalFields.confirmPasword
 }).superRefine((data , ctx)=>{
      if(data.password !== data.confirmPasword){
         ctx.addIssue({code : "custom" ,path:["ConfirmPasword"] , message : "Password Miss Match "})
       if(data.username?.split(" ").length != 2){
         ctx.addIssue({code : "custom" ,path:["username"] , message : "User name must be 2 words "})

       }
      }
     
   })

}


