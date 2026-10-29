import { Router } from "express";
import { createUser } from "./user_controller.js";
import { validate } from "../../middleware/validate.js";
import { createUserSchema } from "./user_schema.js";
import { registerLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/",registerLimiter,validate(createUserSchema),createUser)

export default router;