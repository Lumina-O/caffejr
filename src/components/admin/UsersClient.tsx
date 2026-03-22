"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type AuditEntry = {
  id: string;
  actorEmail: string;
  targetEmail: string;
  action: string;
  detail: string;
  createdAt: string;
};

type Props = {
  users: User[];
  auditLog: AuditEntry[];
  currentUserId: string;
};

const ROLES = ["user", "staff", "admin", "super_admin"] as const;

function roleBadgeClass(role: string) {
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UsersClient({ users, auditLog, currentUserId }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [editForm, setEditForm] = useState({ role: "", isActive: true });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openEdit(user: User) {
    setEditForm({ role: user.role, isActive: user.isActive });
    setEditError("");
    setEditUser(user);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.message ?? "Failed to add user.");
        return;
      }
      setAddOpen(false);
      setAddForm({ name: "", email: "", role: "user" });
      startTransition(() => router.refresh());
    } finally {
      setAddLoading(false);
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setEditError("");
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message ?? "Failed to update user.");
        return;
      }
      setEditUser(null);
      startTransition(() => router.refresh());
    } finally {
      setEditLoading(false);
    }
  }

  async function handleToggleStatus(user: User) {
    setTogglingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) {
        startTransition(() => router.refresh());
      }
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
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
          onClick={() => { setAddError(""); setAddOpen(true); }}
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Add user
        </button>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Team members</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Only super admins can change access rights.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                const isToggling = togglingId === u.id;
                return (
                  <tr key={u.id} className={!u.isActive ? "opacity-50" : ""}>
                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 text-xs text-neutral-400">(you)</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${roleBadgeClass(u.role)}`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {u.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => openEdit(u)}
                          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={isSelf || isToggling}
                          onClick={() => handleToggleStatus(u)}
                          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isToggling ? "..." : u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit log */}
      {auditLog.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">Audit log</h2>
            <p className="mt-1 text-sm text-neutral-600">Recent user management activity.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  {["Actor", "Target", "Change", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-3 text-sm text-neutral-700">{entry.actorEmail}</td>
                    <td className="px-5 py-3 text-sm text-neutral-700">{entry.targetEmail}</td>
                    <td className="px-5 py-3 text-sm text-neutral-600">{entry.detail}</td>
                    <td className="px-5 py-3 text-sm text-neutral-500">{formatDate(entry.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">Invite user</h2>
            <p className="mt-1 text-sm text-neutral-500">
              A temporary password will be emailed to the user. They must set a new one on first login.
            </p>
            <form onSubmit={handleAdd} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Name</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Email</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              {addError && (
                <p className="text-sm text-red-600">{addError}</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                >
                  {addLoading ? "Sending invite…" : "Send invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-neutral-900">Edit user</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {editUser.name} &middot; {editUser.email}
            </p>
            <form onSubmit={handleEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
                  Active account
                </label>
              </div>
              {editError && (
                <p className="text-sm text-red-600">{editError}</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                >
                  {editLoading ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
