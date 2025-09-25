import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

// POST: Bulk create attendance records
export async function POST(req: Request) {
  try {
    const { records } = await req.json();

    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid records format" }, { status: 400 });
    }

    // Check if attendance already exists for this date/session/class
    const firstRecord = records[0];
    if (firstRecord) {
      const existingAttendance = await db
        .select()
        .from(schema.attendance)
        .where(
          and(
            eq(schema.attendance.classId, firstRecord.classId),
            eq(schema.attendance.session, firstRecord.session),
            eq(schema.attendance.date, new Date(firstRecord.date))
          )
        )
        .limit(1);

      if (existingAttendance.length > 0) {
        return NextResponse.json({ 
          error: "Absensi untuk tanggal dan sesi ini sudah ada" 
        }, { status: 409 });
      }
    }

    // Insert all records
    const inserted = await db.insert(schema.attendance).values(records).returning();

    return NextResponse.json({ 
      message: "Absensi berhasil disimpan",
      count: inserted.length 
    });
  } catch (error) {
    console.error("Error saving bulk attendance:", error);
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}