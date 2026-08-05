/// <reference types="node" />
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [modules, subModules, roles, mappings, users] = await Promise.all([
    prisma.module.count({ where: { deleted: false } }),
    prisma.subModule.count({ where: { deleted: false } }),
    prisma.role.count({ where: { deleted: false } }),
    prisma.roleModuleMapping.count({ where: { deleted: false } }),
    prisma.user.count({ where: { deleted: false } }),
  ]);

  console.log(
    JSON.stringify({ modules, subModules, roles, mappings, users }, null, 2),
  );

  const viewer = await prisma.role.findUnique({
    where: { key: "viewer" },
    include: { mapping: true },
  });
  const matrix = viewer?.mapping?.moduleMatrix as Record<string, unknown> | null;
  console.log("viewer_matrix_keys:", matrix ? Object.keys(matrix).join(",") : "none");
  console.log("viewer_has_access:", Boolean(matrix && "access" in matrix));
  console.log("viewer_has_verification:", Boolean(matrix && "verification" in matrix));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
