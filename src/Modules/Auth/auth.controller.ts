
import { Router } from "express";
import authService from "./auth.service";
import { validation } from "../../Middleware/validation.middleware";
import { signUpSchema } from "./auth.validation";

const router = Router();



router.get("/signup",validation(signUpSchema),authService.signup );
router.get("/login",authService.login );

export default router ;