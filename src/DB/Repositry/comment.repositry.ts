import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repositry";
import { IComment } from "../models/comment.model";






export class commentRepositry extends DatabaseRepository<IComment>{

  constructor(protected override readonly model :Model<IComment>){
    super(model);
   }



}