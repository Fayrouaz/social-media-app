import { BadRequestExpetion } from "../../Utils/response/error.response";
import {  IUser } from "../models/user.model";
import { DatabaseRepository } from "./database.repositry";
import { CreateOptions, Model  } from "mongoose";




export class UserRepository extends DatabaseRepository<IUser>{
  // findOneAndUpdate(arg0: { filter: { _id: any; frozenAt: null; }; update: { frozenAt: Date; frozenBy: any; }; options: { new: boolean; }; }) {
  //   throw new Error("Method not implemented.");
  // }
  constructor(protected override readonly model :Model<IUser>){
    super(model);
   }


 async createUser({data =[], options ={}} : {
      data : Partial <IUser>[];
      options?:CreateOptions
   }){
      const [user] = (await this.create({data, options})) || [] ;

      if(!user) {throw new BadRequestExpetion("Fail to signup")
        }
       return user ;
  }


}