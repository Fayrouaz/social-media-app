
import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middleware/validation.middleware";
import { confirmEmislOtpSchema, signUpSchema } from "./auth.validation";
import { tokenTypeEnum } from "../../Utils/security/token";
import { authentication } from "../../Middleware/authentication.middleware";

const router = Router();



router.post("/signup",validation(signUpSchema),authService.signup );
router.post("/login",authService.login );
router.patch("/confirm-email" ,validation(confirmEmislOtpSchema),authService.confirmEmial );
router.post("/revoke-token",  authentication({
    tokenType: tokenTypeEnum.ACCESS, 
    accessRoles: []    
  }),authService.logout );


router.patch(
  "/refresh-token", 
  authentication({ tokenType: tokenTypeEnum.REFRESH ,accessRoles:[]}), 
  authService.refreshToken
);






export default router ;