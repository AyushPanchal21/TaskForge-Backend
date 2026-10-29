import { userRepository } from "./user_repository.js";
import bcrypt from "bcrypt"

export class UserService {

    constructor(private userRepo: userRepository) { }

    async createUser(data:{username: string, email: string, password: string}) {
        const emailnormalize = data.email.trim().toLowerCase();
        const result = await this.userRepo.findByEmail(emailnormalize);
        if (result !== null) {
            return {
                message: "user already exists",
                success: false
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await this.userRepo.createUser(
            data.username,
            emailnormalize,
            hashedPassword
        );
        return {
            message:"user created",
            success:true
        }
    }
}