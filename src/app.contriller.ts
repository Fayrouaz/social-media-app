import express from "express";
import type { Express, Response, Request } from "express";
import cors from "cors";
import helmet  from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { config } from "dotenv";
import { promisify } from "node:util";
import { pipeline } from "node:stream/promises";
config({path : path.resolve("./config/.env.dev")})
import authRouter from "./Modules/Auth/auth.controller";
import { BadRequestExpetion, globalErrorHandler } from "./Utils/response/error.response";
import userRouter from "./Modules/User/user.controller"
import connectDB from "./DB/cinection";
import { createGetPresignedURL, deleteFile, deleteFiles, getFile } from "./Utils/multer/s3.config";
import  postRouter from "./Modules/Post/post.contriller"
import { intialize } from "./Modules/gateway/gateway";



const createS3WreiteStreamPipe = promisify(pipeline)



const limiter = rateLimit({
  windowMs:15*60*100,
  limit:100,
  message:{
  status:429,
  message :"To Many Requests,Please try again later"
  }
})




export const boostrap = async () => {
  const app:Express = express();
  const port:number = Number(process.env.PORT) || 5000;
  await connectDB();
  app.get("/uploads/pre-signed/*path" ,async (req,res )=>{
 
    const {path} = req.params as unknown as {path:string[]}
    const Key = path.join("/")
    const  url =await createGetPresignedURL({
      Key,
   })
     return res.status(200).json({message:"Done" ,url})
  })

  app.get("/uploads/*path" ,async (req,res )=>{
     const {downloadName} = req.query
    const {path} = req.params as unknown as {path:string[]}
    const Key = path.join("/")
    const s3Response = await getFile({ Key })
    if(!s3Response){
      throw new BadRequestExpetion("File Not Found ")
     }
     if(downloadName){
       res.setHeader("Content-Dispostion" ,`attachment; filename="${downloadName}"`)
     }
     res.setHeader("Content-Type",s3Response.ContentType ||"application/octet-stream")
   return  await createS3WreiteStreamPipe((s3Response.Body as any ).pipe(res))
  })

  app.get("/test-s3" ,async(req ,res) =>{
    const {Key} =req.query as unknown as{Key:string}
    const results = await deleteFile({Key :Key as string})
    return res.status(200).json({message:"Done" , results})
 })


  app.get("/test" ,async(req ,res) =>{
    const results = await deleteFiles({
       urls:["","",""]
    })
    return res.status(200).json({message:"Done" , results})

 })


// async function user() {
//   try {
//     const userRepo = new UserRepository(UserModel as Model<IUser>);
    

//     const users = await userRepo.insertMany({
//       data: [
       
//         { username: "ali ahmed", email: `ali1_${Date.now()}@gmail.com`, password: "123" },
//         { username: "omar khaled", email: `omar2_${Date.now()}@gmail.com`, password: "456" }
//       ]
//     });

//     console.log({users});

//   } catch (error) {
//     console.log( error);
//   }
// }
//  user();

 
  app.use(cors() , express.json() , helmet());
  app.use(limiter);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Social Media app👌" });
  });


   app.use("/api/v1/auth" , authRouter)
   app.use("/api/post" , postRouter)

   app.use("/api/v1/user" , userRouter)

  app.use("{/*dummy}", (req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found Handler👨‍🦯" });
  });

  app.use( globalErrorHandler);



 

  const httpServer = app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}🚀`);
  });
    intialize(httpServer)


 
  }
