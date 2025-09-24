import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/**
 * Custom login endpoint
 * Accepts: { username, password }
 * username = NISN (siswa) / NIP (guru/guru BK) / username (admin/petugas)
 * password = sesuai role (lihat requirement)
 */
export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
  }

  // Cari user berdasarkan username
  const user = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
  if (!user[0]) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 401 });
  }
  const u = user[0];

  // Cek password (hash atau plain sesuai implementasi)
  // Untuk demo: password plain (bisa diubah ke hash)
  if (u.password !== password) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  // Ambil role
  const role = await db.select().from(schema.roles).where(eq(schema.roles.id, u.roleId)).limit(1);

  // Return user info + role (tanpa password)
  return NextResponse.json({
    id: u.id,
    username: u.username,
    role: role[0]?.name,
    refId: u.refId,
  });
}
