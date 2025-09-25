
import { db, schema } from "@/db";
import { eq, or, ilike, and, count } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List/filter/search students
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const classId = searchParams.get("classId")?.trim();
  const countOnly = searchParams.get("count") === "true";

  let where = undefined;
  if (q && classId) {
    where = and(
      or(ilike(schema.students.name, `%${q}%`), ilike(schema.students.nisn, `%${q}%`)),
      eq(schema.students.classId, classId)
    );
  } else if (q) {
    where = or(ilike(schema.students.name, `%${q}%`), ilike(schema.students.nisn, `%${q}%`));
  } else if (classId) {
    where = eq(schema.students.classId, classId);
  }

  if (countOnly) {
    const result = where
      ? await db.select({ count: count() }).from(schema.students).where(where)
      : await db.select({ count: count() }).from(schema.students);
    
    return NextResponse.json({ count: result[0].count });
  }

  const students = where
    ? await db.select().from(schema.students).where(where)
    : await db.select().from(schema.students);
  return NextResponse.json(students);
}

// POST: Create student
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.nisn || !data.name) {
    return NextResponse.json({ error: "nisn dan name wajib diisi" }, { status: 400 });
  }
  // Cek NISN unik
  const exist = await db.select().from(schema.students).where(eq(schema.students.nisn, data.nisn)).limit(1);
  if (exist[0]) {
    return NextResponse.json({ error: "NISN sudah terdaftar" }, { status: 409 });
  }
  // Insert student
  const studentId = crypto.randomUUID();
  const studentData = {
    id: studentId,
    ...data,
  };
  const inserted = await db.insert(schema.students).values(studentData).returning();
  
  // Otomatis buat user siswa
  await db.insert(schema.users).values({
    id: crypto.randomUUID(),
    username: data.nisn,
    password: data.nisn,
    roleId: 4, // role siswa
    refId: inserted[0].id,
  });

  return NextResponse.json(inserted[0]);
}
