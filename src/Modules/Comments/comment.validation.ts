


import z from "zod" ;
import { generalFields } from "../../Middleware/validation.middleware";
import { validationFile } from "../../Utils/multer/cloud.multer";



// export const createCommentSchema = {
//   params: z.strictObject({
//     postId: generalFields.id,
//   }),
//   body: z
//     .strictObject({
//       content: z.string().min(2).max(4000).optional(),
//       attachment: z
//         .array(generalFields.file(validationFile.images))
//         .max(3)
//         .optional(),
//       tags: z.array(generalFields.id).max(10).optional(),
//     })
//     .superRefine((data, ctx) => {
//       if (!data.attachment?.length && !data.content) {
//         ctx.addIssue({
//           code: "custom",
//           path: ["content"],
//           message: "Please provide Attachment or content",
//         });
//       }
//    if(data.attachment?.length && data.tags.length !== [...new Set(data.tags)].length){
//         ctx.addIssue({
//       code:"custom",
//       path:["tags"],
//       message:"Please provide Unique Tags"
//     })
//    }

//     }),
// };




export const createCommentSchema = {
  params: z.strictObject({
    postId: generalFields.id,
  }),
  body: z
    .strictObject({
      content: z.string().min(2).max(4000).optional(),
      attachment: z
        .array(generalFields.file(validationFile.images))
        .max(3)
        .optional(),
      tags: z.array(generalFields.id).max(10).optional(),
    })
    .superRefine((data, ctx) => {
      // لازم يكون فيه يا إما محتوى أو مرفق
      if (!data.attachment?.length && !data.content) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "Please provide Attachment or content",
        });
      }

      // لو فيه مرفقات، لازم التاجز تكون فريدة
if (
  data.attachment?.length &&
  data.tags?.length !== [...new Set(data.tags ?? [])].length
) {
  ctx.addIssue({
    code: "custom",
    path: ["tags"],
    message: "Please provide Unique Tags",
  });
}

    }),
};
