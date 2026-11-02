import type { Request, Response } from "express";
import { organizationRepository } from "./organization_repository.js";
import { organizationService } from "./organization_service.js";

const orgRepo = new organizationRepository()
const orgservice = new organizationService(orgRepo)

export const createOrganization = async (req: Request, res: Response) => {
    try {
        const { name, description } = res.locals.validatedBody;
        const createdById = res.locals.userId;
        const result = await orgservice.createOrganization({
            name: name,
            ...(description !== undefined && { description }),
            createdById
        })

        return res.status(201).json({
            message: "organization creation successfully",
            success: true
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const addMembers = async (req: Request, res: Response) => {
    try {
        const organizationId = req.params.organizationId;
        const requesterId = res.locals.userId;
        const { email } = res.locals.validatedBody;

        if (typeof organizationId !== "string") {
            return res.status(400).json({
                message: "Invalid organization ID",
                success: false
            });
        }
        const result = await orgservice.addMember(
            organizationId,
            requesterId,
            email
        )

        return res.status(result.statusCode).json(result);
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error", success: false })
    }
}