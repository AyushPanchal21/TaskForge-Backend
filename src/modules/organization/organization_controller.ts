import type { Request, Response } from "express";
import { organizationRepository } from "./organization_repository.js";
import { organizationService } from "./organization_service.js";
import { AppError } from "../../errors/app_error.js";

const orgRepo = new organizationRepository()
const orgservice = new organizationService(orgRepo)

export const createOrganization = async (req: Request, res: Response) => {
        const { name, description } = res.locals.validatedBody;
        const createdById = res.locals.userId;
        const result = await orgservice.createOrganization({
            name,
            ...(description !== undefined && { description }),
            createdById
        })

        return res.status(result.statusCode).json({
            message: result.message,
            success: result.success
        })
}

export const addMembers = async (req: Request, res: Response) => {

    const organizationId = req.params.organizationId;
    const requesterId = res.locals.userId;
    const { email } = res.locals.validatedBody;

    if (typeof organizationId !== "string") {
        throw new AppError("Invalid organization ID", 400)
    }

    const result = await orgservice.addMember(
        organizationId,
        requesterId,
        email
    )

    return res.status(result.statusCode).json(result);
}

export const removeMembers = async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    const requesterId = res.locals.userId;
    const { email } = res.locals.validatedBody;

    if (typeof organizationId !== "string") {
        throw new AppError("Invalid organization ID", 400)
    }

    const result = await orgservice.removeMember(
        organizationId,
        requesterId,
        email
    )
    return res.status(result.statusCode).json({ message: result.message, success: result.success })
}