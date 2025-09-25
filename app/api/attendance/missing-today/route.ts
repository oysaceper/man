import { db, schema } from "@/db";
import { eq, and, notInArray, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Get classes that haven't taken attendance today
export async function GET(req: Request) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    // Get all classes
    const allClasses = await db.select({ id: schema.classes.id }).from(schema.classes);
    const allClassIds = allClasses.map(c => c.id);

    if (allClassIds.length === 0) {
      return NextResponse.json({ count: 0, classes: [] });
    }

    // Get classes that have attendance today
    const classesWithAttendance = await db
      .selectDistinct({ classId: schema.attendance.classId })
      .from(schema.attendance)
      .where(
        and(
          sql`${schema.attendance.date} >= ${today}`,
          sql`${schema.attendance.date} < ${tomorrow}`
        )
      );

    const classesWithAttendanceIds = classesWithAttendance.map(c => c.classId);

    // Find classes without attendance
    const classesWithoutAttendance = allClassIds.filter(
      id => !classesWithAttendanceIds.includes(id)
    );

    // Get class details for classes without attendance
    const classesMissingAttendance = classesWithoutAttendance.length > 0
      ? await db
          .select()
          .from(schema.classes)
          .where(sql`${schema.classes.id} IN (${classesWithoutAttendance.map(id => `'${id}'`).join(',')})`)
      : [];

    return NextResponse.json({
      count: classesMissingAttendance.length,
      classes: classesMissingAttendance,
    });
  } catch (error) {
    console.error("Error fetching missing attendance:", error);
    return NextResponse.json({ count: 0, classes: [] });
  }
}