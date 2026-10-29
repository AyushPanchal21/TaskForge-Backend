import type { Request, Response } from "express"
import { userRepository } from "./user_repository.js";
import { UserService } from "./user_service.js";
import { Prisma } from "../../generated/prisma/client.js";
import { success } from "zod";

const userRepo = new userRepository();
const userService = new UserService(userRepo);

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = res.locals.validatedBody;

        const result = await userService.createUser({
            username,
            email,
            password
        })

        if (!result.success) {
            return res.status(409).json(result);
        }

        return res.status(201).json(result);


    } catch (err) {
        if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
    ) {
        return res.status(409).json({message:"unique constraint violation",success:false})
    }
        console.error(err)
        res.status(500).json({ message: "internal server error!",success:false})
    }
}