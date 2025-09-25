import { db, schema } from "@/db";
import { eq, count, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all counseling notes
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("count") === "true";
  const followUp = searchParams.get("followUp") === "true";
  const studentId = searchParams.get("studentId")?.trim();

  let where = undefined;
  if (studentId) {
    where = eq(schema.counselingNotes.studentId, studentId);
  }

  if (countOnly) {
    let result;
    if (followUp) {
      // For demo, assume notes containing "tindak lanjut" or "perlu perhatian" need follow-up
      result = await db
        .select({ count: count() })
        .from(schema.counselingNotes)
        .where(
          or(
            ilike(schema.counselingNotes.note, "%tindak lanjut%"),
            ilike(schema.counselingNotes.note, "%perlu perhatian%"),
            ilike(schema.counselingNotes.note, "%follow up%")
          )
        );
    } else {
      result = where
        ? await db.select({ count: count() }).from(schema.counselingNotes).where(where)
        : await db.select({ count: count() }).from(schema.counselingNotes);
    }
    
    return NextResponse.json({ count: result[0]?.count || 0 });
  }

  const notes = where
    ? await db.select().from(schema.counselingNotes).where(where)
    : await db.select().from(schema.counselingNotes);
  return NextResponse.json(notes);
}

// POST: Create counseling note
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId || !data.teacherId || !data.note) {
    return NextResponse.json({ error: "studentId, teacherId, note wajib diisi" }, { status: 400 });
  }
  const noteId = crypto.randomUUID();
  const noteData = {
    id: noteId,
    createdAt: new Date(),
    ...data,
  };
  const inserted = await db.insert(schema.counselingNotes).values(noteData).returning();
  return NextResponse.json(inserted[0]);
}
