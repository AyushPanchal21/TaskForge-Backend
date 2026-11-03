import { prisma } from "../../config/prisma.js"

export class projectRepository {
    async createProject(data: {
        projectName: string;
        projectDescription?: string;
        projectLeadId: string;
        createdById: string;
        organizationId: string;
    }) {
        const res = await prisma.organizationProject.create({
            data: {
                projectName: data.projectName,
                projectDescription: data.projectDescription ?? null,
                createdBy: {
                    connect: {
                        id: data.createdById
                    }
                },
                projectLead: {
                    connect: {
                        id: data.projectLeadId
                    }
                },
                organization: {
                    connect: {
                        id: data.organizationId
                    }
                }
            }
        })
        return res;
    }

    async findOrganizationById(organizationId: string) {
        return await prisma.organization.findUnique({
            where: {
                id: organizationId
            }
        })
    }

    async findMemberByUserId(userId: string, organizationId: string) {
        return await prisma.organizationMember.findFirst({
            where: {
                id: userId,
                organizationId
            }
        })
    }

    async findMemberById(memberId: string, organizationId: string) {
    return await prisma.organizationMember.findFirst({
        where: {
            id: memberId,
            organizationId
        }
    });
}

    async findProjectByName(projectName: string, organizationId: string) {
        return await prisma.organizationProject.findUnique({
            where: {
                organizationId_projectName: {
                    projectName,
                    organizationId
                }
            }
        })
    }
}