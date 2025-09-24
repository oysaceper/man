import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all counseling notes
export async function GET() {
  const notes = await db.select().from(schema.counselingNotes);
  return NextResponse.json(notes);
}

// POST: Create counseling note
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId || !data.teacherId || !data.note) {
    return NextResponse.json({ error: "studentId, teacherId, note wajib diisi" }, { status: 400 });
  }
  const inserted = await db.insert(schema.counselingNotes).values(data).returning();
  return NextResponse.json(inserted[0]);
}
