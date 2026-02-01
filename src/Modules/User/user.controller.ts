
import { Router } from "express";
import userService from "./user.service";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/security/token";
import { roleEnum } from "../../DB/models/user.model";
import { cloudFileUplaod, StorageEnum, validationFile } from "../../Utils/multer/cloud.multer";
import chatRouter from "../chat/chat.controller"

const router = Router();
router.use("/:userId/chat" , chatRouter)

router.get(
  "/profile", 
authentication(tokenTypeEnum.ACCESS,[roleEnum.USER]), 
  userService.getProfile
);


router.patch(
  "/profile-image", 
authentication(tokenTypeEnum.REFRESH, []), 
  cloudFileUplaod({
   validation:validationFile.images,
   storageApproch:StorageEnum.MEMORY,
   maxSizeMB:6
  }).single("attachments"),
  userService.profileImage
);

router.delete(
  "/:userId/freeze-account",
authentication(tokenTypeEnum.ACCESS, [roleEnum.USER, roleEnum.ADMIN]),
  userService.freezeAccount
);

router.delete(
  "/:userId/freeze-account",
authentication(tokenTypeEnum.ACCESS, [roleEnum.ADMIN]),
  userService.freezeAccount
);



router.patch(
  "/cover-image", 
authentication(tokenTypeEnum.REFRESH, []), 
  cloudFileUplaod({
   validation:validationFile.images,
   storageApproch:StorageEnum.MEMORY,
   maxSizeMB:6
  }).array("attachments" , 5),
  userService.coverImages
);

export default router ;