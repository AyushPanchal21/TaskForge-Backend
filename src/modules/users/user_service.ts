import { userRepository } from "./user_repository.js";
import bcrypt from "bcrypt"

export class UserService {

    constructor(private userRepo: userRepository) {}

    async createUser(username: string, email: string, password: string) {
        const emailnormalize =  email.trim().toLowerCase();
       const result = await this.userRepo.findByEmail(emailnormalize);
       if(result !== null){
        return {
            message:"user already exists",
            success:false
        }
       }
       const hashedPassword = await bcrypt.hash(password, 10);
    }
}