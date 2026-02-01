import { roleEnum } from "../DB/models/user.model"; // استورد الـ Enums بتاعتك

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: roleEnum;
        // أضيفي أي حقول تانية بترجع من الـ Token
      };
      decode?: any;
    }
  }
}