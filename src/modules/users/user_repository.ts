import { prisma } from "../../config/prisma.js"

export class userRepository {
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    async createUser(username: string, email: string, password: string) {
        return await prisma.user.create({
            data: {
                username,
                email,
                password
            }
        });
    }
}
