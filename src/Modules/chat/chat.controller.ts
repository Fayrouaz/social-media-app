
import { Router } from "express";
import { authentication } from "../../Middleware/authentication.middleware";
import { endpoint } from "./chat.authoriztion";
import { tokenTypeEnum } from "../../Utils/security/token";
import { validation } from "../../Middleware/validation.middleware";
import { getChatSchema } from "./chat.validation";
import ChatService  from "./chat.service";
const router = Router(

{mergeParams:true}
);


router.get("/" ,authentication(tokenTypeEnum.ACCESS , endpoint.getChat ) ,validation(getChatSchema), ChatService.getChat)




export default router ;