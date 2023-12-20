import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // Insert all data here
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
