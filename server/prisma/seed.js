const prisma = require('../src/db/config');

async function main() {
  await prisma.seedDatabase();
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
