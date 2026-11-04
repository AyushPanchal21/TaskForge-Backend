import { organizationRepository } from "./organization_repository.js";

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
        return organization
    }

    async addMember(organizationId: string, requesterId: string, email: string) {
        const orgCheck = await this.organizationRepo.findOrganizationById(organizationId)
        if (!orgCheck) {
            return {
                message: "Organization not found",
                success: false,
                statusCode: 404
            };
        }

        const memberRoleCheck = await this.organizationRepo.findOrganizationMember(requesterId, organizationId)
        if (!memberRoleCheck || (memberRoleCheck.role !== "OWNER" && memberRoleCheck.role !== "ADMIN")) {
            return {
                success: false,
                message: "You don't have permission to add members",
                statusCode: 403
            };
        }

        const user = await this.organizationRepo.findUserByEmail(email);
        if (!user) {
            return {
                success: false,
                message: "User not found",
                statusCode: 404
            };
        }

        const existingMember = await this.organizationRepo.findOrganizationMember(user.id, organizationId)
        if (existingMember) {
            return {
                success: false,
                message: "User is already a member of this organization",
                statusCode: 409
            };
        }

        const newMember = await this.organizationRepo.addOrganizationMember(user.id, organizationId)
        return {
            success: true,
            message: "Member added successfully",
            statusCode: 201,
            data: newMember
        };
    }

    async removeMember(organizationId: string,requesterId:string, email: string) {
        const orgCheck = await this.organizationRepo.findOrganizationById(organizationId)
        if (!orgCheck) {
            return {
                message: "Organization not found",
                success: false,
                statusCode: 404
            };
        }

        const memberRoleCheck = await this.organizationRepo.findOrganizationMember(requesterId, organizationId)
        if (!memberRoleCheck || (memberRoleCheck.role !== "OWNER" && memberRoleCheck.role !== "ADMIN")) {
            return {
                success: false,
                message: "You don't have permission to remove members",
                statusCode: 403
            };
        }

        const user = await this.organizationRepo.findUserByEmail(email);
        if (!user) {
            return {
                success: false,
                message: "User is not a member of this organization",
                statusCode: 404
            };
        }

        const existingMember = await this.organizationRepo.findOrganizationMember(user.id, organizationId)
        if (!existingMember) {
            return {
                success: false,
                message: "No such User Found",
                statusCode: 404
            };
        }

        if (existingMember.role === "OWNER") {
            return {
                success: false,
                message: "Organization owner cannot be removed",
                statusCode: 403
            };
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