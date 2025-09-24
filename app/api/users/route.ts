import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all users
export async function GET() {
  const users = await db.select().from(schema.users);
  return NextResponse.json(users);
}

// POST: Create user
export async function POST(req: Request) {
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
  const inserted = await db.insert(schema.users).values(data).returning();
  return NextResponse.json(inserted[0]);
}
