import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT: Update user by id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const data = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  const updated = await db.update(schema.users).set(data).where(eq(schema.users.id, id)).returning();
  return NextResponse.json(updated[0]);
}

// DELETE: Delete user by id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
  const deleted = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
  return NextResponse.json(deleted[0]);
}
