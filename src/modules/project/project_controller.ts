import type { Request, Response} from "express"
import { projectRepository } from "./project_repository.js"
import { projectService } from "./project_service.js"
import { AppError } from "../../errors/app_error.js"

const projectRepo = new projectRepository()
const projectservice = new projectService(projectRepo)

export const createProject = async (req: Request, res: Response) => {
        const { projectName, projectDescription, projectLeadId } = res.locals.validatedBody;
        const organizationId = req.params.organizationId;
        const createdById = res.locals.userId

        if(typeof organizationId !== "string"){
            throw new AppError("invalid organization id",400)
        }
        const result = await projectservice.createProject({
            projectName,
            ...(projectDescription !== undefined && { projectDescription }),
            projectLeadId,
            createdById,
            organizationId
        })

        return res.status(result.statusCode).json({
            message: result.message,
            success: result.success
        })
}