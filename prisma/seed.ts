import { prisma } from "../src/database/prisma";
import { popularEstadosSeed } from "../src/service/estado.service";

async function main() {
  await popularEstadosSeed();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
