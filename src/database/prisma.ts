import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "production" ? [] : ["error"],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})