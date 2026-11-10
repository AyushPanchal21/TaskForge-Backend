import { projectRepository } from "./project_repository.js";
import { AppError } from "../../errors/app_error.js";
import { userRepository } from "../users/user_repository.js";

export class projectService {
    constructor(
        private projectRepo: projectRepository,
        private userRepo: userRepository
    ) { }

    async createProject(data: {
        projectName: string;
        projectDescription?: string;
        projectLeadId: string;
        createdById: string;
        organizationId: string;
    }) {
        const organization = await this.projectRepo.findOrganizationById(data.organizationId)
        if (!organization) {
            throw new AppError("organization not found", 404)
        }

        const creator = await this.projectRepo.findMemberByUserId(
            data.createdById,
            data.organizationId
        );
        if (!creator) {
            throw new AppError("Creator is not a member of this organization", 403);
        }

        if (creator.role !== "OWNER" && creator.role !== "ADMIN") {
            throw new AppError("You are not authorized to create projects", 403);
        }

        const projectLead = await this.projectRepo.findMemberById(
            data.projectLeadId,
            data.organizationId
        );
        if (!projectLead) {
            throw new AppError("Project lead is not a member of this organization", 404);
        }

        const existingProject = await this.projectRepo.findProjectByName(
            data.projectName,
            data.organizationId
        );
        if (existingProject) {
            throw new AppError("Project already exists", 409);
        }

        const project = await this.projectRepo.createProject(data);
        return {
            success: true,
            message: "created a project successfully",
            statusCode: 201,
            data: project
        }
    }

    async addProjectMembers(data: { organizationId: string, requesterId: string, projectId: string, email: string }) {
        // check org
        const organization = await this.projectRepo.findOrganizationById(data.organizationId)
        if (!organization) {
            throw new AppError("organization not found", 404)
        }

        // check if project there
        const project = await this.projectRepo.findProjectById(data.projectId, data.organizationId) // asked for name provided id
        if (!project) {
            throw new AppError("Project not found", 404)
        }

        // is requester form same org
        const requester = await this.projectRepo.findMemberByUserId(data.requesterId, data.organizationId)
        if (!requester) {
            throw new AppError("You are not a member of this organization", 403);
        }

        // check requester's authorization
        const isAuthorized =
            requester.role === "OWNER" ||
            requester.role === "ADMIN" ||
            project.projectLeadId === requester.id;

        if (!isAuthorized) {
            throw new AppError(
                "You are not authorized to add members to this project",
                403
            );
        }

        // the user
        const userfinding = await this.userRepo.findByEmail(data.email)
        if (!userfinding) {
            throw new AppError("User not found", 404)
        }

        // is the user from the same org
        const usercheck = await this.projectRepo.findMemberByUserId(userfinding.id, data.organizationId)
        if (!usercheck) {
            throw new AppError("User does not belong to this org", 403)
        }

        // is he already there
        // check if user is already in the project
        const existingMember = await this.projectRepo.findProjectMember(
            data.projectId,
            usercheck.id
        );
        if (existingMember) {
            throw new AppError("User is already a member of this project", 409);
        }

        // add the member
        await this.projectRepo.addProjectMember(data.projectId,usercheck.id)
        return {
            success: true,
            message: "Member added successfully",
            statusCode: 201,
        };
    }
}
