import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "edge";

// GET: Export data kelas ke Excel (.xlsx)
export async function GET() {
  const classes = await db.select().from(schema.classes);
  // Format data untuk Excel
  const data = classes.map((c) => ({
    "Nama Kelas": c.name,
    Tahun: c.year,
    Tingkat: c.level,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Kelas");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=daftar_kelas.xlsx",
    },
  });
}
