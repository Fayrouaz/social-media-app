import z from "zod";
import { generalFields } from "../../Middleware/validation.middleware";
import { validationFile } from "../../Utils/multer/cloud.multer";
import { AllowCommentsEnum, AvalibilityEnum, LIKEUNLIKEEnum } from "../../DB/models/post.model";

export const createPostSchema = {
  body: z.strictObject({

    content: z.string().min(2).max(4000).optional(),
    
    attachment: z.array(generalFields.file(validationFile.images)).max(3).optional(),
    allowComments:z.enum(AllowCommentsEnum).default(AllowCommentsEnum.ALLOW),
     avalibility:z.enum(AvalibilityEnum).default(AvalibilityEnum.PUBLIC),
    likes:z.array(generalFields.id),
    tags : z.array(generalFields.id).max(20)
  }).superRefine((data,ctx)=>{
   if(!data.attachment?.length && !data.content){
    ctx.addIssue({
      code:"custom",
      path:["content"],
      message:"Please provide Attchment or content"
    })

   }
   if(data.attachment?.length && data.tags.length !== [...new Set(data.tags)].length){
        ctx.addIssue({
      code:"custom",
      path:["tags"],
      message:"Please provide Unique Tags"
    })
   }


  })
};


// export const LikeSchema ={
//  params:z.strictObject({
//    postId:generalFields.id,
//  }),
//  query :z.strictObject({
//    action :z.enum(LIKEUNLIKEEnum).default(LIKEUNLIKEEnum.LIKE)
//  }),
// }

export const LikeSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  query: z.strictObject({
    action: z.enum([LIKEUNLIKEEnum.LIKE, LIKEUNLIKEEnum.UNLIKE]).default(LIKEUNLIKEEnum.LIKE)
  }),
  body: z.object({}).optional() 
};