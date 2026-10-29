import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/database/prisma.js"

describe("Create User API", () => {
    it("should create a user successfully", async () => {
        const email = `test-${crypto.randomUUID()}@example.com`;
        try {

            const response = await request(app)
                .post("/api/v1/users")
                .send({
                    username: "testuser",
                    email,
                    password: "Test@12345"
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            const user = await prisma.user.findUnique({
                where: { email }
            });

            expect(user).not.toBeNull();
            expect(user?.username).toBe("testuser");

            const isPasswordValid = await bcrypt.compare(
                "Test@12345",
                user!.password
            );
            expect(isPasswordValid).toBe(true);
        } finally {
            await prisma.user.deleteMany({
                where: { email }
            });
        }

    });

});

afterAll(async () => {
    await prisma.$disconnect();
});