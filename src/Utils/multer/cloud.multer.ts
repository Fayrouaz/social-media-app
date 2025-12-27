import multer, { FileFilterCallback } from "multer"
import os from "node:os"
import {v4 as uuid} from "uuid"
import { Request } from "express"
import { BadRequestExpetion } from "../response/error.response"
export enum StorageEnum {

  MEMORY="MEMORY",
  DISK="DISK"

}

export const validationFile = {
  images:["image/png","image/jpeg" ,"image/jpg"],
  pdf:["application/pdf"],
  doc:["application/msword" ,"application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
}

export const cloudFileUplaod = ({validation = [] , storageApproch=StorageEnum.MEMORY ,maxSizeMB =2}:{validation?:string[],        storageApproch?:StorageEnum ,maxSizeMB ?:number })=>{

  const storage = storageApproch === StorageEnum.MEMORY 
   ?multer.memoryStorage() 
   : multer.diskStorage({
    destination :os.tmpdir(),
    filename: (req: Request, file: Express.Multer.File, cb) => {
          cb(null, `${uuid()}-${file.originalname}`);
        },
   });

  function fileFilter(req:Request,file:Express.Multer.File ,cb:FileFilterCallback){
     if(!validation.includes(file.mimetype)){
        throw new BadRequestExpetion("Invaild File Type");
      }
    return cb(null , true)
  }




  return multer({ fileFilter,limits:{fileSize:maxSizeMB *1024 *1024},storage});
}



