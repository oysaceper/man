import { db, schema } from "@/db";
import { eq, count, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List all classes
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const countOnly = searchParams.get("count") === "true";
  const q = searchParams.get("q")?.trim();
  const year = searchParams.get("year");
  const level = searchParams.get("level")?.trim();

  let where = undefined;
  if (q) {
    where = ilike(schema.classes.name, `%${q}%`);
  }
  if (year && where) {
    where = eq(schema.classes.year, parseInt(year));
  } else if (year) {
    where = eq(schema.classes.year, parseInt(year));
  }
  if (level && where) {
    where = eq(schema.classes.level, level);
  } else if (level) {
    where = eq(schema.classes.level, level);
  }

  if (countOnly) {
    const result = where
      ? await db.select({ count: count() }).from(schema.classes).where(where)
      : await db.select({ count: count() }).from(schema.classes);
    
    return NextResponse.json({ count: result[0].count });
  }

  const classes = where
    ? await db.select().from(schema.classes).where(where)
    : await db.select().from(schema.classes);
  return NextResponse.json(classes);
}

// POST: Create class
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.name || !data.year || !data.level) {
    return NextResponse.json({ error: "name, year, dan level wajib diisi" }, { status: 400 });
  }
  // Insert class
  const classId = crypto.randomUUID();
  const classData = {
    id: classId,
    ...data,
  };
  const inserted = await db.insert(schema.classes).values(classData).returning();
  return NextResponse.json(inserted[0]);
}
