import { prisma } from "../../config/prisma.js"

export class userRepository {
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    async createUser(username: string, email: string, password: string) {

        const res = await prisma.user.create({
            data: {
                username,
                email,
                password
            },
            select: {
                email: true
            }
        });
        return res.email;
    }
}
