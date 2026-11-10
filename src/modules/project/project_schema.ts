import {z} from "zod";

export const createProjectSchema = z.object({
    projectName : z.string().trim().min(5).max(100) ,
    projectDescription: z.string().trim().max(100).optional(),
    projectLeadId: z.string().uuid()
});

export const addMember = z.object({
    email: z.email().trim().toLowerCase(),
})