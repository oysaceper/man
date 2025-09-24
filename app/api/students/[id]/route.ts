import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT: Update student by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  const updated = await db.update(schema.students).set(data).where(eq(schema.students.id, id)).returning();
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
