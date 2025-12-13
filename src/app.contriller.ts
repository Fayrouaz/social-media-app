

// import express from "express";
// import type {Express, Response , Request} from "express";


// export const boostrap = ()=>{
// const app:Express =express();
// const port:number = Number(process.env.PORT) ||5000;

// app.get("/" , (req : Request , res : Response)=>{
//  res.status(200).json({message :"Welcome to Social Media app"})
// })

// app.use("{/*dummy}" , (req : Request , res : Response)=>{
//  res.status(404).json({message :"Not Found Handler"})
// })
// app.listen(port , ()=>{
// console.log(`Server is Running on http://localhost:${port}`);

// })
// }

import express from "express";
import type { Express, Response, Request, NextFunction } from "express";
import cors from "cors";
import helmet  from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { config } from "dotenv";
config({path : path.resolve("./config/.env.dev")})
import authRouter from "./Modules/Auth/auth.controller";
import { globalErrorHandler } from "./Utils/response/error.response";
import connectDB from "./DB/models/cinection";

const limiter = rateLimit({
windowMs:15*60*100,
limit:100,
message:{
status:429,
message :"To Many Requests,Please try again later"
}

})


export const boostrap = () => {
  const app: Express = express();
  const port: number = Number(process.env.PORT) || 5000;
 
  app.use(cors() , express.json() , helmet());
  app.use(limiter);
 connectDB();
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to Social Media app" });
  });


   app.use("/api/v1/auth" , authRouter)
  // Not found handler
  app.use("{/*dummy}", (req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found Handler" });
  });

  app.use( globalErrorHandler);


  app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
  });
};
