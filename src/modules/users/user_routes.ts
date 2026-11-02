import { Router } from "express";
import { createUser ,loginUser,logoutUser} from "./user_controller.js";
import { validate } from "../../middleware/validate.js";
import { createUserSchema,loginUserSchema } from "./user_schema.js";
import { registerLimiter,loginLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/",registerLimiter,validate(createUserSchema),createUser)

router.post("/login",loginLimiter,validate(loginUserSchema),loginUser)

router.post("/logout",logoutUser)

export default router;