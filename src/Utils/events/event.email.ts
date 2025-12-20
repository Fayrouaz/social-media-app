

import { EventEmitter } from "node:events";

import Mail from "nodemailer/lib/mailer";
import { template } from "../email/verify.email.teplete";
import { sendEmail } from "../email/send.email";


export const emailEvents = new EventEmitter();


 interface IEmial extends Mail.Options{
   otp : number;
   username : string;

}

emailEvents.on("confirmEmail" , async (data:IEmial)=>{
 try {
   data.subject = "Confirm Your Email";
   data.html = template(data.otp , data.username , data.subject)
   await sendEmail(data)
 } catch (error) {
   console.log("Fail to senfd Email" , error);
   
 }


})