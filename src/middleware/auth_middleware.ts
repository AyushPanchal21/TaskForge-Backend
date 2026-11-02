import type { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { verifyAccessToken } from "../modules/auth/auth_tokens.js";
import { log } from "node:console";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token || typeof token !== "string") {
        return res.status(401).json({
            message: "Authentication required",
            success: false
        });
    }
    try {
        const decode = verifyAccessToken(token)
        res.locals.userId = decode.userId
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired access token",
            success: false
        });
    }
}