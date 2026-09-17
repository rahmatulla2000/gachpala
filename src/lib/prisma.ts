import { PrismaClient, Prisma } from '@prisma/client';

export { Prisma };

const CLEAN_DB_URL = "postgresql://neondb_owner:npg_tM8TocrADJ1C@ep-dawn-cake-b3wxoilg-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const activeUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('&channel_binding=require', '') : CLEAN_DB_URL;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = activeUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
