import { NextFunction , Request ,Response } from "express";
import {  roleEnum } from "../DB/models/user.model";
import { decodedToken, tokenTypeEnum } from "../Utils/security/token";
import { BadRequestExpetion, ForbiddedExpetion } from "../Utils/response/error.response";









export const authentication = (tokenType: tokenTypeEnum = tokenTypeEnum.ACCESS, accessRoles: roleEnum[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return next(new BadRequestExpetion("Missing Authorization headers"));
      }

      // نمرر الـ tokenType اللي جاي من الـ Router
      const { decode, user } = await decodedToken({
        authorizition: authorization,
        tokenType: tokenType 
      });

      if (accessRoles.length > 0 && !accessRoles.includes(user.role)) {
        return next(new ForbiddedExpetion("You Are Not Authorized to access this route"));
      }

      req.user = user as any;
      req.decode = decode;

      return next();
    } catch (error: any) {
      return next(error);
    }
  };
};