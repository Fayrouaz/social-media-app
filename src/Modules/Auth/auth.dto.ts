import * as z from "zod";
import { loginSchema, signUpSchema } from "./auth.validation";


export  type ISignupDTO = z.infer<typeof signUpSchema.body>


export  type ILoginDTO = z.infer<typeof loginSchema.body>