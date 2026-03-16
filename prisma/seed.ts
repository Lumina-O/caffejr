import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local so DATABASE_URL and seed vars are available when running outside Next.js
config({ path: resolve(process.cwd(), ".env.local") });

import bcrypt from "bcrypt";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.error(
      "Error: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in your .env.local"
    );
    process.exit(1);
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Error: DATABASE_URL must be set in your .env.local");
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString });
  const db = new PrismaClient({ adapter });

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: { email },
    update: { passwordHash, name, role: "super_admin", isActive: true },
    create: { email, name, passwordHash, role: "super_admin" },
  });

  console.log(`✓ Admin user seeded: ${user.email} (role: ${user.role})`);

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
