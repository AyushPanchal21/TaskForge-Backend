import jwt from "jsonwebtoken"

export const generateAccessToken = (userId: string): string => {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    return jwt.sign({
        userId,
        type:"access"
    },
        secret, { expiresIn: "15m" })
}

export const generateRefreshToken = (userId: string): string => {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return jwt.sign({
        userId,
        type:"refresh"
    },
        secret, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string) => {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret)
    if (
        typeof decoded === "string" ||
        typeof decoded.userId !== "string" || decoded.type !== "access"
    ) {
        throw new Error("Invalid token payload");
    }
    return decoded
}

export const verifyRefreshToken = (token: string) => {
    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret)
    if (
        typeof decoded === "string" ||
        typeof decoded.userId !== "string" || decoded.type !== "refresh"
    ) {
        throw new Error("Invalid token payload");
    }
    return decoded
}