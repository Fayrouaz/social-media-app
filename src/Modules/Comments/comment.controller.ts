


import {Router} from "express";

import commentService from "./comment.service";
import { authentication } from "../../Middleware/authentication.middleware";
import {endpoint}  from "../Comments/comment.authorization";
import { tokenTypeEnum } from "../../Utils/security/token";
import { validation } from "../../Middleware/validation.middleware";
import { createCommentSchema } from "./comment.validation";
import { cloudFileUplaod, validationFile } from "../../Utils/multer/cloud.multer";
const router : Router = Router({mergeParams:true});


router.post("/" ,authentication(tokenTypeEnum.ACCESS , endpoint.createCoomment) ,cloudFileUplaod({validation:validationFile.images}).array("attachment" ,3),validation(createCommentSchema),commentService.createComment)


export default router ;