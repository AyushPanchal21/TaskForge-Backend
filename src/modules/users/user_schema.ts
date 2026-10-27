import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(1)
});