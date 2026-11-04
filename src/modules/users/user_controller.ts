import type { Request, Response } from "express"
import { userRepository } from "./user_repository.js";
import { UserService } from "./user_service.js";
import { AppError } from "../../errors/app_error.js";

const userRepo = new userRepository();
const userService = new UserService(userRepo);

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = res.locals.validatedBody;

    const result = await userService.createUser({
        username,
        email,
        password
    })

    if (!result.success) {
        throw new AppError(result.message, 409)
    }

    return res.status(201).json(result);
}

export const loginUser = async (req: Request, res: Response) => {

    const { email, password } = res.locals.validatedBody;

    const result = await userService.loginUser({
        email,
        password
    })
    if (!result.success) {
        throw new AppError(result.message, 401)
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

    return res.status(200).json({ message: result.message, success: result.success });
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