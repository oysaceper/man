import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all parents or filter by studentId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId")?.trim();

  if (studentId) {
    const parents = await db
      .select()
      .from(schema.parents)
      .where(eq(schema.parents.studentId, studentId));
    return NextResponse.json(parents);
  }

  const parents = await db.select().from(schema.parents);
  return NextResponse.json(parents);
}

// POST: Create or update parent
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId) {
    return NextResponse.json({ error: "studentId wajib diisi" }, { status: 400 });
  }

  try {
    // Check if parent record already exists
    const existing = await db
      .select()
      .from(schema.parents)
      .where(eq(schema.parents.studentId, data.studentId))
      .limit(1);

    if (existing[0]) {
      // Update existing record
      const updated = await db
        .update(schema.parents)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(schema.parents.studentId, data.studentId))
        .returning();
      
      return NextResponse.json(updated[0]);
    } else {
      // Create new record
      const parentId = crypto.randomUUID();
      const parentData = {
        id: parentId,
        ...data,
      };
      const inserted = await db.insert(schema.parents).values(parentData).returning();
      return NextResponse.json(inserted[0]);
    }
  } catch (error) {
    console.error("Error saving parent data:", error);
    return NextResponse.json({ error: "Failed to save parent data" }, { status: 500 });
  }
}
