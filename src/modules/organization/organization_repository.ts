import { prisma } from "../../config/prisma.js"

export class organizationRepository {
    async createOrganization(data: {
        name: string;
        slug: string;
        description?: string;
        createdById: string;
    }) {
        const res = await prisma.organization.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description ?? null,
                createdBy: {
                    connect: {
                        id: data.createdById
                    }
                },
                members: {
                    create: {
                        user: {
                            connect: {
                                id: data.createdById
                            }
                        },
                        role: "OWNER"
                    }
                }
            }
        })
        return res
    }

    async addOrganizationMember(userId: string, organizationId: string) {
        return await prisma.organizationMember.create({
            data: {
                userId,
                organizationId,
                role: "MEMBER"
            },
            select: {
                id: true,
                userId: true,
                organizationId: true,
                role: true,
                joinedAt: true
            }
        });
    }

    async removeOrganizationMember(userId: string, organizationId: string) {
        return await prisma.organizationMember.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            }
        })
    }

    async findOrganizationById(organizationId: string) {
        return await prisma.organization.findUnique({
            where: {
                id: organizationId
            }
        })
    }

    async findOrganizationMember(userId: string, organizationId: string) {
        return await prisma.organizationMember.findUnique({
            where: {
                userId_organizationId: {
                    userId: userId,
                    organizationId: organizationId
                }
            }
        })
    }

    async findUserByEmail(email: string) {
        const rews = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                username: true
            }
        });
        return rews;
    }
}