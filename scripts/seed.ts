import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seeding...");

  try {
    // Insert roles
    console.log("Inserting roles...");
    await db.insert(schema.roles).values([
      { id: 1, name: "admin" },
      { id: 2, name: "guru_bk" },
      { id: 3, name: "guru" },
      { id: 4, name: "siswa" },
      { id: 5, name: "petugas_absen" },
    ]).onConflictDoNothing();

    // Check if admin user already exists
    const existingAdmin = await db.select()
      .from(schema.users)
      .where(eq(schema.users.username, "admin"))
      .limit(1);

    if (existingAdmin.length === 0) {
      // Create admin user
      console.log("Creating admin user...");
      const adminId = crypto.randomUUID();
      
      await db.insert(schema.users).values({
        id: adminId,
        username: "admin",
        password: "123456", // Plain text as per requirement
        roleId: 1, // admin role
        refId: adminId, // self-reference for admin
      });
      
      console.log("Admin user created successfully!");
      console.log("Username: admin");
      console.log("Password: 123456");
    } else {
      console.log("Admin user already exists.");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed().then(() => {
  console.log("Seeding process finished.");
  process.exit(0);
});