





import { Model } from "mongoose";
import { DatabaseRepository } from "./database.repositry";
import { IChat } from "../models/chat.model";






export class chatRepositry extends DatabaseRepository<IChat>{

  constructor(protected override readonly model :Model<IChat>){
    super(model);
   }


}