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

    async addProjectMember(projectId: string, organizationMemberId: string) {
        return await prisma.projectMember.create({
            data: {
                projectId,
                organizationMemberId
            }
        });
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
                userId,
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

    async findProjectById(projectId: string, organizationId: string) {
        return await prisma.organizationProject.findFirst({
            where: {
                id: projectId,
                organizationId
            }
        });
    }

    async findProjectMember(projectId: string, organizationMemberId: string) {
        return await prisma.projectMember.findUnique({
            where: {
                projectId_organizationMemberId: {
                    projectId,
                    organizationMemberId
                }
            }
        });
    }
}