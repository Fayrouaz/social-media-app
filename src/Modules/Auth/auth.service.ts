
import {Request , Response} from "express"
import { ILoginDTO, ISignupDTO } from "./auth.dto";



class AuthenticiationService{
 constructor(){
   
 }
    signup = async (req : Request ,res:Response ) :Promise<Response >=>{
      const {username ,email , password , confirmPasword} :ISignupDTO = req.body;
        console.log( {username ,email , password , confirmPasword});
        

      
        return res.status(201).json({message : "Hello from Signup"});
    
  }

 login = (req : Request ,res:Response)=>{
      const {email ,password} :ILoginDTO = req.body ;
       console.log( {email ,password});
       
     res.status(201).json({message : "Hello from Login"});
}

}


export  default new AuthenticiationService();