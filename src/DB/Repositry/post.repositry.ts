import { Model } from "mongoose";
import { IPost } from "../models/post.model";
import { DatabaseRepository } from "./database.repositry";






export class postRepositry extends DatabaseRepository<IPost>{

  constructor(protected override readonly model :Model<IPost>){
    super(model);
   }



}