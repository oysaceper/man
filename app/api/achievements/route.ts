
import { db, schema } from "@/db";
import { eq, or, ilike, and, count } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: List/filter/search achievements
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const studentId = searchParams.get("studentId")?.trim();
  const year = searchParams.get("year")?.trim();
  const countOnly = searchParams.get("count") === "true";

  let where = undefined;
  if (q || studentId || year) {
    const filters = [];
    if (q) {
      filters.push(
        or(
          ilike(schema.achievements.competitionName, `%${q}%`),
          ilike(schema.achievements.field, `%${q}%`),
          ilike(schema.achievements.achievement, `%${q}%`)
        )
      );
    }
    if (studentId) filters.push(eq(schema.achievements.studentId, studentId));
    if (year) filters.push(eq(schema.achievements.year, Number(year)));
    where = filters.length > 1 ? and(...filters) : filters[0];
  }

  if (countOnly) {
    const result = where
      ? await db.select({ count: count() }).from(schema.achievements).where(where)
      : await db.select({ count: count() }).from(schema.achievements);
    
    return NextResponse.json({ count: result[0].count });
  }

  const achievements = where
    ? await db.select().from(schema.achievements).where(where)
    : await db.select().from(schema.achievements);
  return NextResponse.json(achievements);
}

// POST: Create achievement
export async function POST(req: Request) {
  const data = await req.json();
  if (!data.studentId || !data.year || !data.competitionName) {
    return NextResponse.json({ error: "studentId, year, competitionName wajib diisi" }, { status: 400 });
  }
  const achievementId = crypto.randomUUID();
  const achievementData = {
    id: achievementId,
    ...data,
  };
  const inserted = await db.insert(schema.achievements).values(achievementData).returning();
  return NextResponse.json(inserted[0]);
}
