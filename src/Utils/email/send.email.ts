

import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";



export const sendEmail = async(data:Mail.Options)=>{

const trnaspoerter:Transporter = createTransport({
  service :"gmail",
  auth:{
     user:process.env.EMIAL,
     pass:process.env.EAMIL_PASSWORD
  }
 })

   const info = await trnaspoerter.sendMail({
    ...data,
    from : `"Route Academy<${process.env.EMIAL as string}>"`
   })
  console.log("Message Sent :%s" , info.messageId);
  
}