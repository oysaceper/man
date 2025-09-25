import { db, schema } from "@/db";
import { eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Get class where student is attendance officer
export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;

    const classData = await db
      .select()
      .from(schema.classes)
      .where(
        or(
          eq(schema.classes.attendanceOfficer1Id, studentId),
          eq(schema.classes.attendanceOfficer2Id, studentId)
        )
      )
      .limit(1);

    if (!classData[0]) {
      return NextResponse.json({ error: "No class found for this attendance officer" }, { status: 404 });
    }

    return NextResponse.json(classData[0]);
  } catch (error) {
    console.error("Error fetching class by attendance officer:", error);
    return NextResponse.json({ error: "Failed to fetch class" }, { status: 500 });
  }
}