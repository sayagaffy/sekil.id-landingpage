// Database seed script
// Run: npm run db:seed
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed script — add initial data here');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
