
import { CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery } from "mongoose";
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


//   async paginate({
//   filter = {},
//   select = {},
//   options = {},
//   page = 1,
//   size = 5
// }: {
 
//   filter?: QueryFilter<TDocmesnt>; 
//   select?: ProjectionType<TDocmesnt>;
//   options?: QueryOptions<TDocmesnt>;
//   page?: number;
//   size?: number;
// }) {
//    let docsCount : number | undefined =undefined;
//    let pages:number|undefined = undefined;
//    page = Math.floor(page<1?1:page)
//    options.limit=Math.floor(size<1||!size  ? 5 : size)
//    options.skip = (page - 1) * options.limit;
//    docsCount = await this.model.countDocuments(filter);
//    pages = Math.ceil( docsCount /  options.limit)

//    const result  = await this.find({filter , select ,options })
//    return {docsCount , pages , limit:options.limit ,currentPage :page , result}

// }


//  async findById({
//      id , select , options
//   } : {
//     id ?: any;
//     select ?:ProjectionType<TDocmesnt> | null ;
//     options ?: QueryOptions<TDocmesnt> | null;
//    }){
//       const doc = this.model.findOne(id).select(select  || "");
//       if(options?.populate){
//             doc.populate(options.projection as PopulateOptions[])
//        }
//       return  await doc.exec();
//   }

// async findById({
//   id,
//   select,
//   options
// }: {
//   id: Types.ObjectId;
//   select?: ProjectionType<TDocmesnt>;
//   options?: {
//     populate?: PopulateOptions[] | string;
//   };
// }): Promise<HydratedDocument<TDocmesnt> | null> {

//   if (!id) return null;

//   const query = this.model
//     .findById(id)
//     .select(select || " ");

//   if (options?.populate) {
//     query.populate(options.populate as PopulateOptions[]);
//   }
//   if(options?.lean){
//     query.lean(options.lean)
//   }

//   return await query.exec();
// }


async paginate({
  filter = {},
  select = {},
  options = {},
  page = 1,
  size = 5
}: {
  filter?: QueryFilter<TDocmesnt>; 
  select?: ProjectionType<TDocmesnt>;
  options?: QueryOptions<TDocmesnt>;
  page?: number;
  size?: number;
}) {
  let docsCount: number | undefined = undefined;
  let pages: number | undefined = undefined;

  page = Math.floor(page < 1 ? 1 : page);
  options.limit = Math.floor(size < 1 || !size ? 5 : size);
  options.skip = (page - 1) * options.limit;

  docsCount = await this.model.countDocuments(filter as any);
  pages = Math.ceil((docsCount || 0) / (options.limit || 5));

  const result = await this.find({ filter, select, options: options as any });

  return { docsCount, pages, limit: options.limit, currentPage: page, result };
}

async findById({
  id,
  select,
  options
}: {
  id: Types.ObjectId;
  select?: ProjectionType<TDocmesnt>;
  options?: {
    populate?: PopulateOptions[] | string;
    lean?: boolean;
  };
}): Promise<HydratedDocument<TDocmesnt> | TDocmesnt | null> {

  const query = this.model
    .findById(id)
    .select(select || " ");

  if (options?.populate) {
    query.populate(options.populate as PopulateOptions[]);
  }

  if (options?.lean) {
    query.lean();
  }

  return await query.exec();
}


//  async updateOne({
//    filter , update, options
//   } : {
//     filter : QueryFilter<TDocmesnt>;
//     update:UpdateQuery<TDocmesnt>  ;
//     options ?: MongooseUpdateQueryOptions<TDocmesnt> | null;
//    }){
//       return await  this.model.updateOne(filter , {...update ,$inc:{_v :1}} , options);
  
//   }

async updateOne({
  filter,
  update,
  options
}: {
  filter: QueryFilter<TDocmesnt>;
  update: UpdateQuery<TDocmesnt>;
  options?: MongooseUpdateQueryOptions<TDocmesnt> | null;
}) {
  const updateWithInc: UpdateQuery<TDocmesnt> = {
    ...update,
    $inc: {
      _v: 1,
      ...(update.$inc || {}) 
    }
  };

  return await this.model.updateOne(filter, updateWithInc, options);
}

async findOneAndUpdate({
  filter,
  update,
  select,
  options
}: {
  filter: QueryFilter<TDocmesnt>;
  update: UpdateQuery<TDocmesnt>;
  select?: ProjectionType<TDocmesnt> | null;
  options?: {
    populate?: PopulateOptions | PopulateOptions[] | string;
    lean?: boolean;
    new?: boolean;
  };
}): Promise<HydratedDocument<TDocmesnt> | TDocmesnt | null> {

  let query: any = this.model.findOneAndUpdate(
    filter,
    update,
    { new: options?.new ?? true }
  );

  if (select) query = query.select(select);
  if (options?.populate) query = query.populate(options.populate);

  if (options?.lean) {
    return (await query.lean()) as TDocmesnt | null;
  }

  return await query.exec();
}

async deleteOne({
  filter 
}: {
  filter: QueryFilter<TDocmesnt>; 
}): Promise<any> {
  return await this.model.deleteOne(filter);
}


async deleteMeny({
  filter 
}: {
  filter: QueryFilter<TDocmesnt>; 
}): Promise<any> {
  return await this.model.deleteMany(filter);
}


async findOneAndDeltete({
  filter 
}: {
  filter: QueryFilter<TDocmesnt>; 
}): Promise<HydratedDocument <TDocmesnt>|null> {
  return await this.model.findOneAndDelete(filter);
}

 async insertMany({data} : {
      data : Partial <TDocmesnt>[];
   }):Promise<HydratedDocument <TDocmesnt>[] | null >{
    return (await this.model.insertMany(data)) as HydratedDocument <TDocmesnt>[];
  }




async find({
  filter,
  select,
  options
}: {
  filter?: QueryFilter<TDocmesnt>;
  select?: ProjectionType<TDocmesnt> | null;
  options?: {
    populate?: PopulateOptions | PopulateOptions[] | string;
    lean?: boolean;
    limit?: number;
    skip?: number;
    sort?: any;
  };
}): Promise<HydratedDocument<TDocmesnt>[] | TDocmesnt[]> {
  
  const query = this.model.find(filter || {});

  if (select) {
    query.select(select);
  }

  if (options?.populate) {
    query.populate(options.populate as any); 
  }

  if (options?.limit) query.limit(options.limit);
  if (options?.skip) query.skip(options.skip);
  if (options?.sort) query.sort(options.sort);

  if (options?.lean) {
    query.lean();
  }

  return await query.exec();
}




}


