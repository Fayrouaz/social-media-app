




import z from "zod" ;
import { generalFields } from "../../Middleware/validation.middleware";
  

export const getChatSchema  = {

 params:z.strictObject({

   userId:generalFields.id
  })

}