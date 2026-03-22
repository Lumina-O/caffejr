import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import UsersClient from "@/components/admin/UsersClient";

export default async function UsersPage() {
  const currentUser = await requireRole("super_admin");

  const [users, auditLog] = await Promise.all([
    db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <UsersClient
      users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
      auditLog={auditLog.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))}
      currentUserId={currentUser.id}
    />
  );
}
