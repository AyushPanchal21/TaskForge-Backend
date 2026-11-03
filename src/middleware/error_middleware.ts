import type { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/app_error.js"
import { Prisma } from "../generated/prisma/client.js";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }

    if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
    ) {
        return res.status(409).json({
            message: "Resource already exists",
            success: false
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal server error",
        success: false
    });
}
