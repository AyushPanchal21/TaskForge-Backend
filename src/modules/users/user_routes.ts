import { Router } from "express";
import { createUser } from "./user_controller.js";
import { validate } from "../../shared/validate.js";
import { createUserSchema } from "./user_schema.js";

const router = Router();

router.post("/",validate(createUserSchema),createUser)

export default router;