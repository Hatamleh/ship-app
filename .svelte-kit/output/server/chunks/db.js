import { PrismaClient } from "@prisma/client";
//#region src/lib/server/db.ts
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
prisma.$connect().catch((error) => {
	console.error("Failed to connect to database:", error);
});
//#endregion
export { prisma as t };
