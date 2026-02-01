


import { S3Client, ObjectCannedACL,PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommandOutput, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { StorageEnum } from "./cloud.multer";
import {v4 as  uuid } from "uuid";
import { createReadStream } from "fs";
import { BadRequestExpetion } from "../response/error.response";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export  const s3Config  =()=>{
 return new S3Client({
  region:process.env.AWS_REGION as string,
  credentials:{
     accessKeyId:process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY as string
  }
 })


}



export const uploadFile =async({
  storageApproch = StorageEnum.MEMORY,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  ACL="private",
  path ="general",
  file
}:{storageApproch ?: StorageEnum , Bucket?:string ,ACL?:ObjectCannedACL ,path?:string , file:Express.Multer.File})=>{

 const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key:`${process.env.APPLICATION_NAME}/${path}/${uuid()}-${file.originalname}`,
    Body:storageApproch === StorageEnum.MEMORY ?file.buffer : createReadStream(file.path),
    ContentType:file.mimetype
    
  })
 await s3Config().send(command)
  if(!command?.input?.Key)
    throw new BadRequestExpetion("Fail to Upload file");
  
  return command.input.Key ;
}


export const uploadLargeFile = async( { storageApproch = StorageEnum.MEMORY,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  ACL="private",
  path ="general",
  file
}:{storageApproch ?: StorageEnum , Bucket?:string ,ACL?:ObjectCannedACL ,path?:string , file:Express.Multer.File})=>{
 const upload =new Upload({
    client:s3Config(),
    params:{
    Bucket,
    ACL,
    Key:`${process.env.APPLICATION_NAME}/${path}/${uuid()}-${file.originalname}`,
    Body:storageApproch === StorageEnum.MEMORY ?file.buffer : createReadStream(file.path),
    ContentType:file.mimetype
    },
    partSize:500*1024*1024
  })

 upload.on("httpUploadProgress" ,(progress)=>{
   console.log("Upload Progress " ,progress);
   
 })

 const {Key} = await upload.done();
 if(!Key) throw new BadRequestExpetion("Fail to Upload File");

 return Key
}




export const uploadFiles = async( { storageApproch = StorageEnum.MEMORY,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  ACL="private",
  path ="general",
  files
}:{storageApproch ?: StorageEnum , Bucket?:string ,ACL?:ObjectCannedACL ,path?:string , files:Express.Multer.File[]})=>{
 
  let urls:string[]=[];

   urls = await Promise.all(files.map((file)=>{
   return uploadFile({storageApproch,
     Bucket,
     ACL,
     path ,
    file
      })

   }))



  // for(const file of files){
  //   const key = await uploadFile({storageApproch,
  // Bucket,
  // ACL,
  // path ,
  // file
  //  })

  //  urls.push(key)
  // }
   return urls;
}




export const createRresingnedURL=async({
  Bucket = process.env.AWS_BUCKET_NAME  as string ,
  path="general",
  ContentType,
  originalname,
  expiresIn =120}:{
   Bucket ?:string,
   path?:string,
   ContentType:string,
   originalname:string,
   expiresIn?:number
  
})=>{

 const command = new PutObjectCommand({
    Bucket,
    Key:`${process.env.APPLICATION_NAME}/${path}/${uuid()}-presigned-${originalname}`,
    ContentType,
  })

  const url = await getSignedUrl(s3Config(),command , {expiresIn})

  if(!url || !command?.input.Key){
     throw new BadRequestExpetion("Fail to generate Url")
  }

  return {url ,Key:command.input.Key}
}



export const getFile = async( {
  Bucket = process.env.AWS_BUCKET_NAME  as string ,
  Key
 }
   :{
   Bucket ?:string,
   Key : string,
  
})=>{
  const coomand =new GetObjectCommand({
      Bucket ,
      Key
  })

  return await s3Config().send(coomand);
}




export const createGetPresignedURL=async({
  Bucket = process.env.AWS_BUCKET_NAME  as string ,
  Key,
  //downloadName ="dummy",
  expiresIn =120}:{
   Bucket ?:string,
   Key:string,
   //downloadName?:string
   expiresIn?:number
  
})=>{

 const command = new GetObjectCommand({
    Bucket,
    Key,
    //ResponseContentDisposition : `attachment; filename="${downloadName}`
  })

  const url = await getSignedUrl(s3Config(),command , {expiresIn})

  if(!url || !command?.input.Key){
     throw new BadRequestExpetion("Fail to generate Url")
  }

  return {url ,Key:command.input.Key}
}


export const deleteFile = async({
  Bucket = process.env.AWS_BUCKET_NAME  as string ,
  Key,

}:{
   Bucket ?:string,
   Key:string,

}):Promise<DeleteObjectsCommandOutput>=>{

 const commond = new DeleteObjectCommand({ Bucket ,  Key})
  return await s3Config().send(commond);


}



export const deleteFiles = async({
  Bucket = process.env.AWS_BUCKET_NAME  as string ,
  urls,
  Quiet = false
}:{
   Bucket ?:string,
   urls:string[],
   Quiet?: boolean
   

}):Promise<DeleteObjectsCommandOutput>=>{

  let objects = urls.map((url)=>{
     return {Key : url}
  })
 const commond = new DeleteObjectsCommand({ Bucket ,
    Delete:{
    Objects: objects,
    Quiet
  }})
  return await s3Config().send(commond);

}