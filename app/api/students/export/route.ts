import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "edge";

// GET: Export data siswa ke Excel (.xlsx)
export async function GET() {
  const students = await db.select().from(schema.students);
  // Format data untuk Excel
  const data = students.map((s) => ({
    NISN: s.nisn,
    Nama: s.name,
    Kelas: s.classId || "",
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=daftar_siswa.xlsx",
    },
  });
}
