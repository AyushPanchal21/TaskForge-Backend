import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig(() => {
    const result = config({
        path: ".env.test",
        override: true
    });

    if (result.error) {
        throw new Error("Failed to load .env.test");
    }

    if (!process.env.DATABASE_URL?.includes("/newbackendpro_test")) {
        throw new Error("Tests must use the test database");
    }

    return {
        test: {
            environment: "node",
            include: ["src/**/*.test.ts"]
        }
    };
});