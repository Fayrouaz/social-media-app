import mongoose, {HydratedDocument, model, models, Schema , Types} from "mongoose"

import { generateHash } from "../../Utils/security/hash";
import { emailEvents } from "../../Utils/events/event.email";



  export enum GenderEnum {
     MALE = "MALE",
     FEMALE ="FEMALE"
  }

    export enum roleEnum {
       USER = "USER",
       ADMIN = "ADMIN"
    }

export interface IUser {
  _id?: Types.ObjectId;

  firstName: string;
  lastName: string;
  username?: string | undefined;

  slug: string;
  email: string;
friends?: Types.ObjectId[];
  confirmEmailOTP?: string | null | undefined;
  confirmedAt?: Date | null | undefined;

  password: string;
  resetPasswordOTP?: string | null | undefined;

  phone?: string | null | undefined;
  address?: string | null | undefined;

  gender: GenderEnum;
  role: roleEnum;

  profileImage?: string | null | undefined;

  frozenAt?: Date | null | undefined;
  frozenBy?: Types.ObjectId | null | undefined;
  changeCredintionalDate :Date;
  createdAt: Date;
  updatedAt: Date;


}

export const userSchema= new Schema(
 {
  firstName :{type : String ,required : true , minLength:2 , maxLength : 25},
  lastName:{type : String ,required : true , minLength:2 , maxLength : 25},
slug:{type : String ,required : true , minLength:2 , maxLength : 51},
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  email :{type : String ,required : true , unique:true},
  confirmEmailOTP : String ,
  confirmedAt : Date ,
   password :{type : String ,required : true } ,
   resetPasswordOTP : String,
   phone :String ,
   address : String ,
   profileImage :String ,
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
frozenAt: {
  type: Date,
  default: null
},
  changeCredintionalDate:{
  type: Date,
  default: null
},
frozenBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},




 } , 

{timestamps:true , toJSON : {virtuals : true } , toObject :{virtuals : true}})

   userSchema.virtual("username").set(function (value : string ){
    const [firstName , lastName] = value.split(" ") || [];
    this.set({firstName , lastName ,slug:value.replaceAll(/\s+/g , "-")})

   }).get((function (){
     return `${this.firstName}  ${this.lastName}`
   }))


//  userSchema.pre("save",function(next){
//   console.log("Pre Hook" , this);
//   next(new BadRequestExpetion("Error from HOOK 0"))
//  })

// userSchema.pre("validate", function() { 
//   console.log("pre hoock1" , this);
  
//   if (!this.slug?.includes("-")) {
//     throw new BadRequestExpetion("Slug is Required and must hold like ex: first-name-last-name");
//   }

// });

// userSchema.pre("save", async function(this:HUserDocument &{wasNew : boolean} ) { 
//    this.wasNew =this.isNew;   
//   console.log(this.wasNew);
//   console.log("Pre Hook1" , this.isModified("password"));
//   this.password = await generateHash(this.password)
 
// });

;

// userSchema.post("save",  function(doc ,next) { 
//   const that =this as unknown as HUserDocument & {wasNew : boolean};
//    console.log(that.wasNew);
   
//   if(that.wasNew){
//  emailEvents.emit("confirmEmail" ,{ to:this.email,otp:123456})
//   }
// });
// userSchema.pre("findOne",  async function() { 
//  console.log({this:this , query:this.getQuery()});
//  const query = this.getQuery();
//  this.getQuery({...query ,freezedAt : true})
 
// });


// userSchema.pre("updateOne", async function() {

//    console.log({this:this});
//    const query = this.getQuery();
//    const update = this.getQuery() as UpdateQuery<HUserDocument>;
//   // console.log("Filter:", this.getFilter());
//   // console.log("Update:", this.getUpdate());
//   if(update.frozenAt){
//      const tokenModel = new TokenRepository(TokenModel);
//      await tokenModel .deleteAllUserTokens(userId);

//   }
//   console.log(query , update);
  
// });


// src/DB/models/user.model.ts

// userSchema.pre(["findOneAndUpdate" ,"updateOne"], async function () {
//   const query = this.getQuery(); 
//   const update = this.getUpdate() as any;

//   if (update.frozenAt) {
//      this.setUpdate({...update , changeCredintionalDate: new Date})
// //     const userId = query._id;

// //     if (userId) {
// //       const tokenRepo = new TokenRepository(TokenModel);
// //       await tokenRepo.deleteAllUserTokens(userId);
      
// //       console.log(`[Middleware] Tokens deleted for user: ${userId}`);
// //     }
//    }

//   console.log({query, update});
//  });

// userSchema.post(["findOneAndUpdate" ,"updateOne"], async function () {
//   const query = this.getQuery(); 
//   const update = this.getUpdate() as UpdateQuery<HUserDocument>;
//   if(update["$set"].changeCredintionalDate){
//     const userId = query._id;

//    const tokenRepo = new TokenRepository(TokenModel);
//    await tokenRepo.deleteAllUserTokens(userId);
//   }
//  });

// userSchema.pre("deleteOne" , async function(){
//   const query = this.getQuery();
//   const userId = query._id;

//    const tokenRepo = new TokenRepository(TokenModel);
//    await tokenRepo.deleteAllUserTokens(userId);
//  })

// userSchema.pre("insertMany", async function({ docs , next} ){

//   for( const doc of docs ){
//     doc.password = await generateHash(doc.password );
//   }
//   next();
//  })


// userSchema.pre("insertMany", async function (docs) {
//   if (Array.isArray(docs)) {
//     for (const doc of docs) {
//       if (doc.password) {
//         doc.password = await generateHash(doc.password);
//       }
//     }
//   }
// });

userSchema.pre("save" ,async function(this:HUserDocument&{wasNew : boolean ; confirmEmailPlain ?:string}  ,next){
 this.wasNew = this.isNew;
  if(this.isModified("password")){
     this.password = await generateHash( this.password);
   }

  if(this.isModified("confirmEmailOTP")){
    this.confirmEmailPlain = this.confirmEmailOTP as string;
     this.confirmEmailOTP = await generateHash(this.confirmEmailOTP as string );
   }
   
 })

//  userSchema.post("save" , async function(doc){
//     const that = this as unknown as HUserDocument & {wasNew:boolean ; confirmEmailPlain?:string}
//    if(that.wasNew && that.confirmEmailPlain ){
//               emailEvents.emit("confirmEmail" ,{
//              to:this.email,
//              username:this.username,
//              otp : that.confirmEmailPlain
//            })
//    }

//  })

userSchema.post("save", async function (doc) {
  const that = doc as HUserDocument & { wasNew?: boolean; confirmEmailPlain?: string };

  if (that.wasNew && that.confirmEmailPlain) {
    emailEvents.emit("confirmEmail", {
      to: that.email,          
      username: that.username, 
      otp: that.confirmEmailPlain
    });
  }
});






export const UserModel = models.User || model("User" , userSchema);
export type HUserDocument = HydratedDocument<IUser>;