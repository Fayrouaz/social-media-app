import { Model, Types } from "mongoose";
import { ChatModel, IMessage } from "../../DB/models/chat.model";
import { IUser, UserModel } from "../../DB/models/user.model";
import { chatRepositry } from "../../DB/Repositry/chat.repositry";
import { UserRepository } from "../../DB/Repositry/user.repositry";
import { IGetChatDTO, ISayHiDTO, ISendMessageDTO } from "./chat.dto";
import { Request, Response } from "express";
import { BadRequestExpetion, NotFoundExpetion } from "../../Utils/response/error.response";





 export  class ChatService{
 private _chatModel = new chatRepositry(ChatModel);
 private _userModel = new UserRepository(UserModel as Model<IUser>)
constructor(){}

   getChat=async(req:Request , res:Response)=>{
      const {userId} = req.params as IGetChatDTO 
      const chat = await this._chatModel.findOne({
       filter:{
        participants:{
           $all:[req.user?._id as Types.ObjectId , Types.ObjectId.createFromHexString(userId)]
        },
        group:{$exists:false}
       },
       options:{
        populate:"participants"
       }
      });
      if(!chat){
        throw new NotFoundExpetion("Fail to find out")
      }
     return res.status(200).json({message:"Done" , data:{chat}})
   }


 sayHi =({message , socket , callback ,io}:ISayHiDTO)=>{

  try {
    console.log(message);
    callback ? callback("I Recirved Message ") : undefined
    
  } catch (error) {
    socket.emit("custom_error" ,error)
  }
 }

  sendMessage = async({content , socket , sendTo ,io}:ISendMessageDTO)=>{
  try {
   const createdBy =socket.creditionals?.user?._id as Types.ObjectId;
   console.log({content ,sendTo , createdBy});
   const user =await this._userModel.findOne({
     filter:{
      _id:Types.ObjectId.createFromHexString(sendTo),
      friends:{$in:[createdBy]}
     }
   })
   if(!user) throw new NotFoundExpetion("User Not Found")
    const chat = await this._chatModel.findOneAndUpdate({
       
       filter:{
        participants:{
           $all:[ createdBy as Types.ObjectId , Types.ObjectId.createFromHexString(sendTo)]
        },
        group:{$exists:false}

       },
       update:{
        $push:{
         message:{
           content,
           createdBy
         }
        }
       }
    })
    if(!chat){
       const [newChat] =(await this._chatModel.create({
         data:[{
          createdBy,
          message:[{ content, createdBy } as IMessage],

         participants :[createdBy ,Types.ObjectId.createFromHexString(sendTo)]
         }]
       
       }))||[]
      if(!newChat)  throw new BadRequestExpetion("Fail to create chat ")
    }
       io.emit("successMessage" ,{ content })
       io.emit("newMessage" ,{content , from:socket.creditionals?.user})
  } catch (error : any) {
  socket.emit("custom_error", error)
  }
  }







}


export  default new  ChatService();