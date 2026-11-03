import { Router } from "express";
import { middleware } from "../../middleware/auth_middleware.js";
import { validate } from "../../middleware/validate.js";
import { createProject } from "./project_controller.js";
import {createProjectSchema} from "./project_schema.js"

const router = Router()

router.post("/:organizationId/project",middleware,validate(createProjectSchema),createProject)

export default router;
