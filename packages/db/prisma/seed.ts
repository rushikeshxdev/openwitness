/**
 * Seed: Module/SubModule catalog, role matrices (assigned nodes only), admin user.
 * Admin password is for local/dev only — change in any shared environment.
 */
import { PrismaClient, UserType, type Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const ACTION = { read: 1, write: 2, modify: 3, delete: 4, all: 5 } as const;

type Matrix = Prisma.InputJsonValue;

const catalog = [
  {
    moduleId: 1,
    moduleKey: "dashboard",
    name: "Dashboard",
    path: "/",
    icon: "layout-dashboard",
    sortOrder: 1,
    subs: [] as {
      subKey: string;
      permissionPath: string;
      name: string;
      path: string;
      nodeType: "page" | "tab" | "action";
      sortOrder: number;
    }[],
  },
  {
    moduleId: 2,
    moduleKey: "events",
    name: "Events",
    path: "/events",
    icon: "calendar",
    sortOrder: 2,
    subs: [
      { subKey: "list", permissionPath: "events-list", name: "List", path: "/events", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "detail", permissionPath: "events-detail", name: "Detail", path: "/events/:id", nodeType: "page" as const, sortOrder: 2 },
      { subKey: "report", permissionPath: "events-report", name: "Report incident", path: "/report", nodeType: "page" as const, sortOrder: 3 },
      { subKey: "map", permissionPath: "events-map", name: "Map", path: "/map", nodeType: "page" as const, sortOrder: 4 },
    ],
  },
  {
    moduleId: 3,
    moduleKey: "evidence",
    name: "Evidence",
    path: "/evidence",
    icon: "file-video",
    sortOrder: 3,
    subs: [
      { subKey: "list", permissionPath: "evidence-list", name: "List", path: "/evidence", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "upload", permissionPath: "evidence-upload", name: "Upload", path: "/evidence/new", nodeType: "page" as const, sortOrder: 2 },
      { subKey: "detail", permissionPath: "evidence-detail", name: "Detail", path: "/events/:id/evidence/:evidenceId", nodeType: "page" as const, sortOrder: 3 },
      { subKey: "compare", permissionPath: "evidence-compare", name: "Compare", path: "/evidence/compare", nodeType: "page" as const, sortOrder: 4 },
    ],
  },
  {
    moduleId: 4,
    moduleKey: "verification",
    name: "Verification",
    path: "/verification",
    icon: "shield-check",
    sortOrder: 4,
    subs: [
      { subKey: "queue", permissionPath: "verification-queue", name: "Queue", path: "/verification", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "decide", permissionPath: "verification-decide", name: "Decide", path: "/verification", nodeType: "action" as const, sortOrder: 2 },
    ],
  },
  {
    moduleId: 5,
    moduleKey: "reports",
    name: "Reports",
    path: "/reports",
    icon: "newspaper",
    sortOrder: 5,
    subs: [
      { subKey: "list", permissionPath: "reports-list", name: "List", path: "/reports", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "publish", permissionPath: "reports-publish", name: "Publish", path: "/reports", nodeType: "action" as const, sortOrder: 2 },
    ],
  },
  {
    moduleId: 6,
    moduleKey: "organizations",
    name: "Organizations",
    path: "/organizations",
    icon: "building-2",
    sortOrder: 6,
    subs: [
      { subKey: "list", permissionPath: "organizations-list", name: "List", path: "/organizations", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "detail", permissionPath: "organizations-detail", name: "Detail", path: "/organizations/:id", nodeType: "page" as const, sortOrder: 2 },
      { subKey: "manage", permissionPath: "organizations-manage", name: "Manage", path: "/organizations", nodeType: "action" as const, sortOrder: 3 },
    ],
  },
  {
    moduleId: 7,
    moduleKey: "notifications",
    name: "Notifications",
    path: "/notifications",
    icon: "bell",
    sortOrder: 7,
    subs: [
      { subKey: "list", permissionPath: "notifications-list", name: "List", path: "/notifications", nodeType: "page" as const, sortOrder: 1 },
    ],
  },
  {
    moduleId: 8,
    moduleKey: "profile",
    name: "Profile",
    path: "/profile",
    icon: "user",
    sortOrder: 8,
    subs: [
      { subKey: "view", permissionPath: "profile-view", name: "View", path: "/profile", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "settings", permissionPath: "profile-settings", name: "Settings", path: "/profile/settings", nodeType: "page" as const, sortOrder: 2 },
    ],
  },
  {
    moduleId: 9,
    moduleKey: "access",
    name: "Access",
    path: "/admin/access",
    icon: "key-round",
    sortOrder: 9,
    subs: [
      { subKey: "users", permissionPath: "access-users", name: "Users", path: "/admin/access/users", nodeType: "page" as const, sortOrder: 1 },
      { subKey: "roles", permissionPath: "access-roles", name: "Roles", path: "/admin/access/roles", nodeType: "page" as const, sortOrder: 2 },
      { subKey: "modules", permissionPath: "access-modules", name: "Modules", path: "/admin/access/modules", nodeType: "page" as const, sortOrder: 3 },
    ],
  },
] as const;

function self(actions: number[]) {
  return { _self: actions };
}

function branch(moduleSelf: number[], subs: Record<string, number[]>) {
  const node: Record<string, unknown> = { _self: moduleSelf };
  for (const [key, actions] of Object.entries(subs)) {
    node[key] = self(actions);
  }
  return node;
}

/** Full catalog with all actions — Admin only */
function fullMatrix(): Matrix {
  const matrix: Record<string, unknown> = {};
  for (const mod of catalog) {
    const subs: Record<string, number[]> = {};
    for (const sub of mod.subs) {
      subs[sub.subKey] = [ACTION.all];
    }
    matrix[mod.moduleKey] = branch([ACTION.all], subs);
  }
  return matrix as Matrix;
}

const viewerMatrix: Matrix = {
  dashboard: self([ACTION.read]),
  events: branch([ACTION.read], {
    list: [ACTION.read],
    detail: [ACTION.read],
    map: [ACTION.read],
  }),
  evidence: branch([ACTION.read], {
    list: [ACTION.read],
    detail: [ACTION.read],
    compare: [ACTION.read],
  }),
  organizations: branch([ACTION.read], {
    list: [ACTION.read],
    detail: [ACTION.read],
  }),
  profile: branch([ACTION.read], {
    view: [ACTION.read],
  }),
} as Matrix;

const contributorMatrix: Matrix = {
  dashboard: self([ACTION.read]),
  events: branch([ACTION.read, ACTION.write], {
    list: [ACTION.read],
    detail: [ACTION.read],
    report: [ACTION.read, ACTION.write],
    map: [ACTION.read],
  }),
  evidence: branch([ACTION.read, ACTION.write], {
    list: [ACTION.read],
    upload: [ACTION.read, ACTION.write, ACTION.modify],
    detail: [ACTION.read],
    compare: [ACTION.read],
  }),
  reports: branch([ACTION.read], {
    list: [ACTION.read],
  }),
  organizations: branch([ACTION.read], {
    list: [ACTION.read],
    detail: [ACTION.read],
  }),
  notifications: branch([ACTION.read], {
    list: [ACTION.read],
  }),
  profile: branch([ACTION.read], {
    view: [ACTION.read],
    settings: [ACTION.read, ACTION.modify],
  }),
} as Matrix;

const verifierMatrix: Matrix = {
  ...(contributorMatrix as object),
  verification: branch([ACTION.read, ACTION.write], {
    queue: [ACTION.read],
    decide: [ACTION.read, ACTION.write, ACTION.modify],
  }),
} as Matrix;

const orgAdminMatrix: Matrix = {
  ...(contributorMatrix as object),
  organizations: branch([ACTION.read, ACTION.write, ACTION.modify], {
    list: [ACTION.read],
    detail: [ACTION.read],
    manage: [ACTION.read, ACTION.write, ACTION.modify],
  }),
  reports: branch([ACTION.read, ACTION.write], {
    list: [ACTION.read],
    publish: [ACTION.read, ACTION.write, ACTION.modify],
  }),
} as Matrix;

const roles = [
  {
    key: "viewer",
    name: "Viewer",
    description: "Read-only browse of public events and evidence",
    userType: UserType.member,
    matrix: viewerMatrix,
  },
  {
    key: "contributor",
    name: "Contributor",
    description: "Report incidents and upload evidence",
    userType: UserType.member,
    matrix: contributorMatrix,
  },
  {
    key: "verifier",
    name: "Verifier",
    description: "Contributor plus verification queue decisions",
    userType: UserType.staff,
    matrix: verifierMatrix,
  },
  {
    key: "org_admin",
    name: "Org Admin",
    description: "Manage organization profile and publish org reports",
    userType: UserType.staff,
    matrix: orgAdminMatrix,
  },
  {
    key: "admin",
    name: "Admin",
    description: "Full catalog access including Access admin",
    userType: UserType.admin,
    matrix: fullMatrix(),
  },
] as const;

const ADMIN_EMAIL = "admin@openwitness.local";
const ADMIN_PASSWORD = "ChangeMeAdmin!123";

async function main() {
  for (const mod of catalog) {
    const moduleRow = await prisma.module.upsert({
      where: { moduleKey: mod.moduleKey },
      create: {
        moduleKey: mod.moduleKey,
        moduleId: mod.moduleId,
        name: mod.name,
        path: mod.path,
        icon: mod.icon,
        sortOrder: mod.sortOrder,
        enabled: true,
      },
      update: {
        moduleId: mod.moduleId,
        name: mod.name,
        path: mod.path,
        icon: mod.icon,
        sortOrder: mod.sortOrder,
        enabled: true,
        deleted: false,
      },
    });

    for (const sub of mod.subs) {
      await prisma.subModule.upsert({
        where: {
          moduleRefId_subKey: {
            moduleRefId: moduleRow.id,
            subKey: sub.subKey,
          },
        },
        create: {
          moduleRefId: moduleRow.id,
          subKey: sub.subKey,
          permissionPath: sub.permissionPath,
          name: sub.name,
          path: sub.path,
          nodeType: sub.nodeType,
          sortOrder: sub.sortOrder,
          enabled: true,
        },
        update: {
          permissionPath: sub.permissionPath,
          name: sub.name,
          path: sub.path,
          nodeType: sub.nodeType,
          sortOrder: sub.sortOrder,
          enabled: true,
          deleted: false,
        },
      });
    }
  }

  const roleIds: Record<string, string> = {};

  for (const role of roles) {
    const row = await prisma.role.upsert({
      where: { key: role.key },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        userType: role.userType,
        enabled: true,
      },
      update: {
        name: role.name,
        description: role.description,
        userType: role.userType,
        enabled: true,
        deleted: false,
      },
    });
    roleIds[role.key] = row.id;

    await prisma.roleModuleMapping.upsert({
      where: { roleId: row.id },
      create: {
        roleId: row.id,
        moduleMatrix: role.matrix,
      },
      update: {
        moduleMatrix: role.matrix,
        deleted: false,
      },
    });
  }

  const passwordHash = hashSync(ADMIN_PASSWORD, 12);
  const adminRoleId = roleIds.admin;

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      name: "OpenWitness Admin",
      handle: "admin",
      passwordHash,
      userType: UserType.admin,
      persona: "other",
      activeRoleId: adminRoleId,
      emailVerifiedAt: new Date(),
      identityVerified: true,
    },
    update: {
      passwordHash,
      userType: UserType.admin,
      activeRoleId: adminRoleId,
      deleted: false,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRoleId,
      },
    },
    create: {
      userId: admin.id,
      roleId: adminRoleId,
    },
    update: {
      deleted: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_COMPLETE",
      resourceType: "System",
      metadata: {
        modules: catalog.length,
        roles: roles.length,
      },
    },
  });

  console.log("Seed complete.");
  console.log(`  Modules: ${catalog.length}`);
  console.log(`  Roles:   ${roles.map((r) => r.key).join(", ")}`);
  console.log(`  Admin:   ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
