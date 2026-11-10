import type { Request, Response } from "express"
import { projectRepository } from "./project_repository.js"
import { projectService } from "./project_service.js"
import { AppError } from "../../errors/app_error.js"
import { userRepository } from "../users/user_repository.js"

const projectRepo = new projectRepository();
const userRepo = new userRepository();
const projectservice = new projectService(projectRepo, userRepo);

export const createProject = async (req: Request, res: Response) => {
    const { projectName, projectDescription, projectLeadId } = res.locals.validatedBody;
    const organizationId = req.params.organizationId;
    const createdById = res.locals.userId

    if (typeof organizationId !== "string") {
        throw new AppError("invalid organization id", 400)
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

export const addMemberToProject = async (req: Request, res: Response) => {
    const projectId = req.params.projectId;
    const organizationId = req.params.organizationId;

    if (typeof organizationId !== "string") {
        throw new AppError("invalid organization id", 400)
    }
    if (typeof projectId !== "string") {
        throw new AppError("invalid project id", 400)
    }

    const requesterId = res.locals.userId;
    const { email } = res.locals.validatedBody;

    const result = await projectservice.addProjectMembers({
        organizationId,
        requesterId,
        projectId,
        email
    })

    return res.status(result.statusCode).json({
        message: result.message,
        success: result.success
    })
}