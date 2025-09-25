import { db, schema } from "@/db";
import { NextResponse } from "next/server";

// GET: List all roles
export async function GET() {
  try {
    const roles = await db.select().from(schema.roles).orderBy(schema.roles.id);
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}