
import { db, schema } from "@/db";
import { eq, or, ilike, and, count } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List/filter/search teachers
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const subject = searchParams.get("subject")?.trim();
  const countOnly = searchParams.get("count") === "true";

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

  if (countOnly) {
    const result = where
      ? await db.select({ count: count() }).from(schema.teachers).where(where)
      : await db.select({ count: count() }).from(schema.teachers);
    
    return NextResponse.json({ count: result[0].count });
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
  const teacherId = crypto.randomUUID();
  const teacherData = {
    id: teacherId,
    ...data,
  };
  const inserted = await db.insert(schema.teachers).values(teacherData).returning();
  
  // Otomatis buat user guru
  await db.insert(schema.users).values({
    id: crypto.randomUUID(),
    username: data.nip,
    password: data.nip,
    roleId: data.roleId || 3, // 2: guru_bk, 3: guru
    refId: inserted[0].id,
  });
  return NextResponse.json(inserted[0]);
}
