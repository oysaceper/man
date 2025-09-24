
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List/filter attendance
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId")?.trim();
  const classId = searchParams.get("classId")?.trim();
  const date = searchParams.get("date")?.trim();
  const status = searchParams.get("status")?.trim();
  const session = searchParams.get("session")?.trim();

  const filters = [];
  if (studentId) filters.push(eq(schema.attendance.studentId, studentId));
  if (classId) filters.push(eq(schema.attendance.classId, classId));
  if (date) filters.push(eq(schema.attendance.date, new Date(date)));
  if (status) filters.push(eq(schema.attendance.status, status));
  if (session) filters.push(eq(schema.attendance.session, session));
  const where = filters.length > 1 ? and(...filters) : filters[0];

  const attendance = where
    ? await db.select().from(schema.attendance).where(where)
    : await db.select().from(schema.attendance);
  return NextResponse.json(attendance);
}

// POST: Create attendance
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.classId || !data.studentId || !data.date || !data.session || !data.status) {
    return NextResponse.json({ error: "classId, studentId, date, session, status wajib diisi" }, { status: 400 });
  }
  const inserted = await db.insert(schema.attendance).values(data).returning();
  return NextResponse.json(inserted[0]);
}
