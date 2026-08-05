import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
// This is a Next.js best practice for working with Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Warm up Prisma connection on first import to avoid cold start delays
// This runs a simple query to establish the database connection early
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error)
})
