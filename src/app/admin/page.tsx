import { requireRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Welcome back, {user.name ?? "Admin"}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Bookings</p>
          <p className="mt-2 text-2xl font-semibold">24</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Open tickets</p>
          <p className="mt-2 text-2xl font-semibold">8</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Customers</p>
          <p className="mt-2 text-2xl font-semibold">132</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Staff online</p>
          <p className="mt-2 text-2xl font-semibold">3</p>
        </div>
      </div>
    </section>
  );
}