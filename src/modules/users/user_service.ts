import { userRepository } from "./user_repository.js";
import { generateAccessToken,generateRefreshToken } from "../auth/auth_tokens.js";
import bcrypt from "bcrypt"

export class UserService {

    constructor(private userRepo: userRepository) {}

    async createUser(data: { username: string, email: string, password: string }) {
        const normalizeEmail = data.email.trim().toLowerCase();
        const result = await this.userRepo.findByEmail(normalizeEmail);
        if (result !== null) {
            return {
                message: "user already exists",
                success: false
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
       const user =  await this.userRepo.createUser(
            data.username,
            normalizeEmail,
            hashedPassword
        );
        return {
            success: true,
            message: "user created",
            statusCode: 201,
            data: user
        }
    }

    async loginUser(data: { email: string, password: string }) {
        const normalizeEmail = data.email.trim().toLowerCase()

        const result = await this.userRepo.findByEmail(normalizeEmail)
        if (result === null) {
            return {
                message: "Invalid email or password",
                success: false
            }
        }
        const isPasswordValid = await bcrypt.compare(
            data.password,
            result.password
        );

        if (!isPasswordValid) {
            return {
                message: "Invalid email or password",
                success: false
            };
        }

        const accesstoken = generateAccessToken(result.id)
        const refreshtoken = generateRefreshToken(result.id)

        return {
            message: "user LoggedIn",
            success: true,
            accesstoken,
            refreshtoken,
            statusCode: 200,
        }
    }
}