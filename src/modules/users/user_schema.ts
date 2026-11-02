import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().trim().min(1),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8)
});

export const loginUserSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1)
});