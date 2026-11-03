import { projectRepository } from "./project_repository.js";
import { AppError } from "../../errors/app_error.js";

export class projectService {
    constructor(private projectRepo: projectRepository) { }

    async createProject(data: {
        projectName: string;
        projectDescription?: string;
        projectLeadId: string;
        createdById: string;
        organizationId: string;
    }) {
        const organization = await this.projectRepo.findOrganizationById(data.organizationId)
        if (!organization) {
            throw new AppError("organization not found",404)
        }

        const creator = await this.projectRepo.findMemberByUserId(
            data.createdById,
            data.organizationId
        );
        if (!creator) {
            throw new AppError("Creator is not a member of this organization",403);
        }

        if (creator.role !== "OWNER" && creator.role !== "ADMIN") {
            throw new AppError("You are not authorized to create projects",403);
        }

        const projectLead = await this.projectRepo.findMemberById(
            data.projectLeadId,
            data.organizationId
        );
        if (!projectLead) {
            throw new AppError("Project lead is not a member of this organization",400);
        }

        const existingProject = await this.projectRepo.findProjectByName(
            data.projectName,
            data.organizationId
        );
        if (existingProject) {
            throw new AppError("Project already exists",409);
        }

        const project = await this.projectRepo.createProject(data);
        return project;
    }
}
