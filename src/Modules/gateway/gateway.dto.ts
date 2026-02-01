import { Socket } from "socket.io";
import { HUserDocument } from "../../DB/models/user.model";
import { JwtPayload } from "jsonwebtoken";

 export  interface IAuthSocket extends Socket{
   
    creditionals ?:{
      user:Partial<HUserDocument>;
      decode:JwtPayload
    }
  }