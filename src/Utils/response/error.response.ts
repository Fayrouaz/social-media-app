
import { NextFunction , Request ,Response } from "express"

export interface IError  extends Error{
 statusCode:number ;
}

export class  ApplicationExpition extends Error{
  constructor(message : string ,public statusCode:number = 400 ,options?:ErrorOptions){
     super(message , options)
    this.name = this.constructor.name;
  }
}

export class BadRequestExpetion extends ApplicationExpition {
  constructor(message : string ,options?:ErrorOptions){
     super(message ,400 , options)
  }
}

export class NotFoundExpetion extends ApplicationExpition {
  constructor(message : string ,options?:ErrorOptions){
     super(message ,404 , options)
  }
}

export class ConflictExpetion extends ApplicationExpition {
  constructor(message : string ,options?:ErrorOptions){
     super(message ,409 , options)
  }
}

export class UnothorizedtExpetion extends ApplicationExpition {
  constructor(message : string ,options?:ErrorOptions){
     super(message ,401 , options)
  }
}
// Forbidded


export class ForbiddedExpetion extends ApplicationExpition {
  constructor(message : string ,options?:ErrorOptions){
     super(message ,403 , options)
  }
}

export const globalErrorHandler = (err : IError , req:Request,res:Response,next : NextFunction)=>{
   return res.status(err.statusCode || 500)
   .json({
     message : err.message || "Some thing Went Rong " ,
      stack : process.env.MODE === "DEV" ? err.stack : undefined ,
      cause: err.cause})
  }