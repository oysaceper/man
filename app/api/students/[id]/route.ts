import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Get specific student
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const student = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, id))
      .limit(1);

    if (!student[0]) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

// PUT: Update student by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  
  const updated = await db
    .update(schema.students)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(schema.students.id, id))
    .returning();
  
  return NextResponse.json(updated[0]);
}

// DELETE: Delete student by id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  // Hapus user juga
  await db.delete(schema.users).where(eq(schema.users.refId, id));
  const deleted = await db.delete(schema.students).where(eq(schema.students.id, id)).returning();
  return NextResponse.json(deleted[0]);
}
