import { db, schema } from "@/db";
import { eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Get achievements for a specific student
export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;
    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get("count") === "true";

    if (countOnly) {
      const result = await db
        .select({ count: count() })
        .from(schema.achievements)
        .where(eq(schema.achievements.studentId, studentId));

      return NextResponse.json({ count: result[0]?.count || 0 });
    }

    const achievements = await db
      .select()
      .from(schema.achievements)
      .where(eq(schema.achievements.studentId, studentId))
      .orderBy(schema.achievements.year);

    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Error fetching student achievements:", error);
    return NextResponse.json({ count: 0 });
  }
}