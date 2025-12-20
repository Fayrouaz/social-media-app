import * as z from "zod";
import { confirmEmislOtpSchema, loginSchema, signUpSchema } from "./auth.validation";


export  type ISignupDTO = z.infer<typeof signUpSchema.body>


export  type ILoginDTO = z.infer<typeof loginSchema.body>

export  type IConfirmEmailDTO = z.infer<typeof  confirmEmislOtpSchema.body>