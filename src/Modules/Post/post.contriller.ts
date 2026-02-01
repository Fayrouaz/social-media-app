


import {Router} from "express";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/security/token";
import { roleEnum } from "../../DB/models/user.model";
import { validation } from "../../Middleware/validation.middleware";
import {createPostSchema, LikeSchema} from "../Post/post.validation"
import postService from "./post.service";
import commentRouter from "../Comments/comment.controller"
const router : Router = Router();
router.use("/:postId/comment" , commentRouter)

router.post("/" ,authentication(tokenTypeEnum.ACCESS,[roleEnum.USER]) , validation(createPostSchema) , postService.createPost) ;
router.patch("/:postId/like" ,authentication(tokenTypeEnum.ACCESS,[roleEnum.USER]) , validation(LikeSchema) , postService.likePost) ;

router.get("/" ,authentication(tokenTypeEnum.ACCESS,[roleEnum.USER]) , postService.getAllPosts) ;


export default router ;