import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all classes
export async function GET() {
  const classes = await db.select().from(schema.classes);
  return NextResponse.json(classes);
}

// POST: Create class
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.name || !data.year || !data.level) {
    return NextResponse.json({ error: "name, year, dan level wajib diisi" }, { status: 400 });
  }
  // Insert class
  const inserted = await db.insert(schema.classes).values(data).returning();
  return NextResponse.json(inserted[0]);
}
