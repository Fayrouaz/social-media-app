import {HydratedDocument, model, models, Schema , Types} from "mongoose"
//import { maxLength, minLength } from "zod";


  export enum GenderEnum {
     MALE = "MALE",
     FEMALE ="FEMALE"
  }

    export enum roleEnum {
       USER = "USER",
       ADMIN = "ADMIN"
    }
 export interface IUser {
  _id ?: Types.ObjectId;
  firstName : string ;
  lastName : string ;
  username ?: string ;

  email : string;
  confirmEmailOTP ?: string ;
  confirmedAt ?: Date;

  password : string;
  resetPasswordOTP ?: string ;
  phone ?:string ;
  address ?: string ;
  gender : GenderEnum ;
  role : roleEnum;

  createdAt: Date;
  updatedAt: Date;
}

export const userSchema= new Schema(
 {
  firstName :{type : String ,required : true , minLength:2 , maxLength : 25},
  lastName:{type : String ,required : true , minLength:2 , maxLength : 25},
  email :{type : String ,required : true , unique:true},
  confirmEmailOTP : String ,
  confirmedAt : Date ,
   password :{type : String ,required : true } ,
   resetPasswordOTP : String,
   phone :String ,
   address : String ,
   gender :{
    type : String,
    enum : Object.values(GenderEnum),
    default : GenderEnum.MALE ,
  },

    role:{
    type : String,
    enum : Object.values(roleEnum),
    default : roleEnum.USER ,
  },

// otpCreatedAt: { 
//     type: Date, 
//     expires: 120 
//   }

 } , 

{timestamps:true , toJSON : {virtuals : true } , toObject :{virtuals : true}})

   userSchema.virtual("username").set(function (value : string ){
    const [firstName , lastName] = value.split(" ") || [];
    this.set({firstName , lastName})

   }).get((function (){
     return `${this.firstName}  ${this.lastName}`
   }))

export const UserModel = models.User || model("User" , userSchema);
export type HUserDocument = HydratedDocument<IUser>;