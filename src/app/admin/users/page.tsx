import { requireRole } from "@/lib/auth";

const users = [
  {
    id: "USR-001",
    name: "Owen De Guzman",
    email: "owen@example.com",
    role: "super_admin",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Sarah Nielsen",
    email: "sarah@example.com",
    role: "admin",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Ali Ahmed",
    email: "ali@example.com",
    role: "staff",
    status: "Pending",
  },
  {
    id: "USR-004",
    name: "John Hansen",
    email: "john@example.com",
    role: "user",
    status: "Active",
  },
];

function getRoleBadgeClass(role: string) {
  switch (role) {
    case "super_admin":
      return "bg-black text-white";
    case "admin":
      return "bg-neutral-800 text-white";
    case "staff":
      return "bg-neutral-200 text-neutral-900";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export default async function UsersPage() {
  await requireRole("super_admin");

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
            Users
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Manage user access, review roles, and keep the platform secure.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Add user
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Team members
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Only super admins should be able to change sensitive access rights.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                    {user.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-700">
                    {user.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {user.status}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TODO: Replace mock users with database data, add edit role modal, and log all role changes in an audit trail. */}
    </section>
  );
}