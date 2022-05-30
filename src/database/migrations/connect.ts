import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function connect() {
  await prismaClient.$connect();
}

connect();

export const prisma = prismaClient;
