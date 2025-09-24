import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all documents
export async function GET() {
  const documents = await db.select().from(schema.documents);
  return NextResponse.json(documents);
}

// POST: Create document
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId || !data.type || !data.file) {
    return NextResponse.json({ error: "studentId, type, file wajib diisi" }, { status: 400 });
  }
  const inserted = await db.insert(schema.documents).values(data).returning();
  return NextResponse.json(inserted[0]);
}
