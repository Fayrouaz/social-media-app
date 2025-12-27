
import { Router } from "express";
import userService from "./user.service";
import { authentication } from "../../Middleware/authentication.middleware";
import { tokenTypeEnum } from "../../Utils/security/token";
import { roleEnum } from "../../DB/models/user.model";
import { cloudFileUplaod, StorageEnum, validationFile } from "../../Utils/multer/cloud.multer";


const router = Router();


router.get(
  "/profile", 
  authentication({
    tokenType: tokenTypeEnum.ACCESS, 
    accessRoles: [roleEnum.USER]    
  }), 
  userService.getProfile
);


router.patch(
  "/profile-image", 
  authentication({ tokenType: tokenTypeEnum.REFRESH ,accessRoles:[]}), 
  cloudFileUplaod({
   validation:validationFile.images,
   storageApproch:StorageEnum.MEMORY,
   maxSizeMB:6
  }).single("attachments"),
  userService.profileImage
);

router.patch(
  "/cover-image", 
  authentication({ tokenType: tokenTypeEnum.REFRESH ,accessRoles:[]}), 
  cloudFileUplaod({
   validation:validationFile.images,
   storageApproch:StorageEnum.MEMORY,
   maxSizeMB:6
  }).array("attachments" , 5),
  userService.coverImages
);

export default router ;