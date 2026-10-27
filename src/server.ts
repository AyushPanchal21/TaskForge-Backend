import "dotenv/config";
import app from "./app.js"
import {prisma} from "./infrastructure/database/prisma.js"

const PORT = process.env.PORTNUMBER || 1221;

async function startServer() {
    try {
        await prisma.$connect();

        console.log("PostgreSQL connected successfully!");

        app.listen(PORT, () => {
            console.log(`server running on : ${PORT}`);
        });

    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}

startServer();