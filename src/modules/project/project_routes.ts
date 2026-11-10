import { Router } from "express";
import { middleware } from "../../middleware/auth_middleware.js";
import { validate } from "../../middleware/validate.js";
import { createProject ,addMemberToProject} from "./project_controller.js";
import {createProjectSchema,addMember} from "./project_schema.js"

const router = Router()

router.post("/:organizationId/project",middleware,validate(createProjectSchema),createProject)

router.post("/:organizationId/:projectId/members",middleware,validate(addMember),addMemberToProject)

export default router;
