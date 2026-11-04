import { Router } from "express";
import { createOrganization ,addMembers,removeMembers} from "./organization_controller.js";
import {middleware} from "../../middleware/auth_middleware.js"
import { validate } from "../../middleware/validate.js";
import { createOrganizationSchema ,addMembersSchema,removeMembersSchema} from "./organization_schema.js";

const router = Router()

router.post("/",middleware,validate(createOrganizationSchema),createOrganization)

router.post("/:organizationId/members",validate(addMembersSchema),middleware,addMembers)

router.delete("/:organizationId/members",validate(removeMembersSchema),middleware,removeMembers)

export default router;
