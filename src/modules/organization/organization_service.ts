import { organizationRepository } from "./organization_repository.js";
import { AppError } from "../../errors/app_error.js";

export class organizationService {
    constructor(private organizationRepo: organizationRepository) { }

    async createOrganization(data: {
        name: string;
        description?: string;
        createdById: string;
    }) {
        const slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
        const organization = await this.organizationRepo.createOrganization({
            name: data.name,
            slug,
            createdById: data.createdById,
            ...(data.description !== undefined && {
                description: data.description
            })
        })
        return {
            success: true,
            message: "Organization created successfully",
            statusCode: 201,
            data: organization
        };
    }

    async addMember(organizationId: string, requesterId: string, email: string) {
        const orgCheck = await this.organizationRepo.findOrganizationById(organizationId)
        if (!orgCheck) {
            throw new AppError("Organization not found", 404)
        }

        const memberRoleCheck = await this.organizationRepo.findOrganizationMember(requesterId, organizationId)
        if (!memberRoleCheck || (memberRoleCheck.role !== "OWNER" && memberRoleCheck.role !== "ADMIN")) {
            throw new AppError("You don't have permission to add members", 403)
        }

        const user = await this.organizationRepo.findUserByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404)
        }

        const existingMember = await this.organizationRepo.findOrganizationMember(user.id, organizationId)
        if (existingMember) {
            throw new AppError("User is already a member of this organization", 409)
        }

        const newMember = await this.organizationRepo.addOrganizationMember(user.id, organizationId)
        return {
            success: true,
            message: "Member added successfully",
            statusCode: 201,
            data: newMember
        };
    }

    async removeMember(organizationId: string, requesterId: string, email: string) {
        const orgCheck = await this.organizationRepo.findOrganizationById(organizationId)
        if (!orgCheck) {
            throw new AppError("organization not found", 404)
        }

        const memberRoleCheck = await this.organizationRepo.findOrganizationMember(requesterId, organizationId)
        if (!memberRoleCheck || (memberRoleCheck.role !== "OWNER" && memberRoleCheck.role !== "ADMIN")) {
            throw new AppError("You don't have permission to remove members", 403)
        }

        const user = await this.organizationRepo.findUserByEmail(email);
        if (!user) {
            throw new AppError("User not found", 404)
        }

        const existingMember = await this.organizationRepo.findOrganizationMember(user.id, organizationId)
        if (!existingMember) {
            throw new AppError("User is not a member of this organization", 404)
        }

        if (existingMember.role === "OWNER") {
            throw new AppError("Organization owner cannot be removed", 403)
        }

        const removemember = await this.organizationRepo.removeOrganizationMember(user.id, organizationId)
        return {
            success: true,
            message: "Member removed successfully",
            statusCode: 200,
            data: removemember
        };
    }
}