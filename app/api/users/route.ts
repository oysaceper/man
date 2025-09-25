import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all users with role information
export async function GET() {
  try {
    const users = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        roleId: schema.users.roleId,
        refId: schema.users.refId,
        roleName: schema.roles.name,
      })
      .from(schema.users)
      .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
      .orderBy(schema.users.username);
    
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST: Create user
export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Validasi sederhana
    if (!data.username || !data.password || !data.roleId) {
      return NextResponse.json({ error: "username, password, dan roleId wajib diisi" }, { status: 400 });
    }
    
    // Cek username unik
    const exist = await db.select().from(schema.users).where(eq(schema.users.username, data.username)).limit(1);
    if (exist[0]) {
      return NextResponse.json({ error: "Username sudah terdaftar" }, { status: 409 });
    }
    
    // Insert user
    const userId = crypto.randomUUID();
    const userData = {
      id: userId,
      username: data.username,
      password: data.password, // In production, hash this!
      roleId: data.roleId,
      refId: data.refId || null,
    };
    
    const inserted = await db.insert(schema.users).values(userData).returning();
    return NextResponse.json(inserted[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
