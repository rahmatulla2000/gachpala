import { PrismaClient, Prisma } from '@prisma/client';

export { Prisma };

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_tM8TocrADJ1C@ep-dawn-cake-b3wxoilg-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DB_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
