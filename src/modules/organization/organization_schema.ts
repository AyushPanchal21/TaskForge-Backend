import { z } from "zod";

export const createOrganizationSchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().max(100).optional(),
});

export const addMembersSchema = z.object({
    email: z.email().trim().toLowerCase(),
})
