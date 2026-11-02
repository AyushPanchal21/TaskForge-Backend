import { Router } from "express";
import { createOrganization ,addMembers} from "./organization_controller.js";
import {middleware} from "../../middleware/auth_middleware.js"
import { validate } from "../../middleware/validate.js";
import { createOrganizationSchema ,addMembersSchema} from "./organization_schema.js";

const router = Router()

router.post("/",middleware,validate(createOrganizationSchema),createOrganization)

router.post("/:organizationId/members",validate(addMembersSchema),middleware,addMembers)

export default router;
