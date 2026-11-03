import type { Request, Response ,NextFunction} from "express"
import { projectRepository } from "./project_repository.js"
import { projectService } from "./project_service.js"

const projectRepo = new projectRepository()
const projectservice = new projectService(projectRepo)

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectName, projectDescription, projectLeadId } = res.locals.validatedBody;
        const organizationId = req.params.organizationId;
        const createdById = res.locals.userId

        if(typeof organizationId !== "string"){
            return res.status(400).json({message:"invalid organization id",success:false})
        }
        const result = await projectservice.createProject({
            projectName,
            ...(projectDescription !== undefined && { projectDescription }),
            projectLeadId,
            createdById,
            organizationId
        })

        return res.status(201).json({
            message: "created a project successfully",
            success: true
        })

    } catch (err) {
       next(err)
    }
}