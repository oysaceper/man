import { db, schema } from "@/db";
import { eq, count, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Get attendance statistics for a specific student
export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;

    // Get total attendance count for this student
    const totalAttendance = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(
        and(
          eq(schema.attendance.studentId, studentId),
          eq(schema.attendance.status, "hadir")
        )
      );

    // Get total school days (all attendance records for this student)
    const totalSchoolDays = await db
      .select({ count: count() })
      .from(schema.attendance)
      .where(eq(schema.attendance.studentId, studentId));

    // Calculate attendance percentage
    const attendanceCount = totalAttendance[0]?.count || 0;
    const schoolDaysCount = totalSchoolDays[0]?.count || 0;
    const percentage = schoolDaysCount > 0 ? Math.round((attendanceCount / schoolDaysCount) * 100 * 10) / 10 : 0;

    return NextResponse.json({
      total: attendanceCount,
      totalSchoolDays: schoolDaysCount,
      percentage: percentage,
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return NextResponse.json({
      total: 0,
      totalSchoolDays: 0,
      percentage: 0,
    });
  }
}