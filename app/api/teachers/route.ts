
import { db, schema } from "@/db";
import { eq, or, ilike, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List/filter/search teachers
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const subject = searchParams.get("subject")?.trim();

  let where = undefined;
  if (q && subject) {
    where = and(
      or(ilike(schema.teachers.name, `%${q}%`), ilike(schema.teachers.nip, `%${q}%`)),
      ilike(schema.teachers.subject, `%${subject}%`)
    );
  } else if (q) {
    where = or(ilike(schema.teachers.name, `%${q}%`), ilike(schema.teachers.nip, `%${q}%`));
  } else if (subject) {
    where = ilike(schema.teachers.subject, `%${subject}%`);
  }
  const teachers = where
    ? await db.select().from(schema.teachers).where(where)
    : await db.select().from(schema.teachers);
  return NextResponse.json(teachers);
}

// POST: Create teacher
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.nip || !data.name) {
    return NextResponse.json({ error: "nip dan name wajib diisi" }, { status: 400 });
  }
  // Cek NIP unik
  const exist = await db.select().from(schema.teachers).where(eq(schema.teachers.nip, data.nip)).limit(1);
  if (exist[0]) {
    return NextResponse.json({ error: "NIP sudah terdaftar" }, { status: 409 });
  }
  // Insert teacher
  const inserted = await db.insert(schema.teachers).values(data).returning();
  // Otomatis buat user guru
  await db.insert(schema.users).values({
    id: inserted[0].id,
    username: data.nip,
    password: data.nip,
    roleId: data.roleId || 2, // 2: guru_bk, 3: guru
    refId: inserted[0].id,
  });
  return NextResponse.json(inserted[0]);
}
