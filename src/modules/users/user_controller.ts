import type { Request, Response } from "express"
import { userRepository } from "./user_repository.js";
import { UserService } from "./user_service.js";
import { Prisma } from "../../generated/prisma/client.js";

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
            return res.status(409).json({ message: "unique constraint violation", success: false })
        }
        console.error(err)
        return res.status(500).json({ message: "internal server error!", success: false })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = res.locals.validatedBody;

        const result = await userService.loginUser({
            email,
            password
        })
        if (!result.success) {
            return res.status(401).json(result);
        }

        res.cookie("accessToken", result.accesstoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", result.refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({message:result.message,success:result.success});

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "internal server error!", success: false })
    }
}

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const { state } = res.locals.validatedBody;

        if (state === "logout") {
            return res.status(200).json({ message: "logged out!" })
        }

    } catch (err) {
        console.error(err)
        return res.status(400).json({ message: "there was a problem logging out!", success: false })
    }
}