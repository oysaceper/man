import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all parents
export async function GET() {
  const parents = await db.select().from(schema.parents);
  return NextResponse.json(parents);
}

// POST: Create parent
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId) {
    return NextResponse.json({ error: "studentId wajib diisi" }, { status: 400 });
  }
  const inserted = await db.insert(schema.parents).values(data).returning();
  return NextResponse.json(inserted[0]);
}
