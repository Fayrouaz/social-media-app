
import { Router } from "express";
import userService from "./user.service";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/security/token";
import { roleEnum } from "../../DB/models/user.model";


const router = Router();


router.get(
  "/profile", 
  authentication({
    tokenType: tokenTypeEnum.ACCESS, 
    accessRoles: [roleEnum.USER]    
  }), 
  userService.getProfile
);
export default router ;