import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT: Update class by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  const updated = await db.update(schema.classes).set(data).where(eq(schema.classes.id, id)).returning();
  return NextResponse.json(updated[0]);
}

// DELETE: Delete class by id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  const deleted = await db.delete(schema.classes).where(eq(schema.classes.id, id)).returning();
  return NextResponse.json(deleted[0]);
}
