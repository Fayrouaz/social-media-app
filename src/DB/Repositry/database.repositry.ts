

import { CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";
//  import { IUser } from "../models/user.model";
//  import { BadRequestExpetion } from "../../Utils/response/error.response";


export  abstract class DatabaseRepository<TDocmesnt>{

 constructor(protected readonly model : Model<TDocmesnt>){}
 async create({data , options} : {
      data : Partial <TDocmesnt>[];
      options?:CreateOptions
   }):Promise<HydratedDocument <TDocmesnt>[] | undefined >{
    return await this.model.create(data  as any , options)
  }




 async findOne({
   filter , select , options
  } : {
    filter ?: QueryFilter<TDocmesnt>;
    select ?:ProjectionType<TDocmesnt> | null ;
    options ?: QueryOptions<TDocmesnt> | null;
   }){
      const doc = this.model.findOne(filter).select(select  || "");
      if(options?.populate){
            doc.populate(options.projection as PopulateOptions[])
       }
      return  await doc.exec();
  }

 async findById({
     id , select , options
  } : {
    id ?: any;
    select ?:ProjectionType<TDocmesnt> | null ;
    options ?: QueryOptions<TDocmesnt> | null;
   }){
      const doc = this.model.findOne(id).select(select  || "");
      if(options?.populate){
            doc.populate(options.projection as PopulateOptions[])
       }
      return  await doc.exec();
  }

 async updateOne({
   filter , update, options
  } : {
    filter : QueryFilter<TDocmesnt>;
    update:UpdateQuery<TDocmesnt>  ;
    options ?: MongooseUpdateQueryOptions<TDocmesnt> | null;
   }){
      return await  this.model.updateOne(filter , {...update ,$inc:{_v :1}} , options);
  
  }


}