import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "edge";

// GET: Export data guru ke Excel (.xlsx)
export async function GET() {
  const teachers = await db.select().from(schema.teachers);
  // Format data untuk Excel
  const data = teachers.map((t) => ({
    NIP: t.nip,
    Nama: t.name,
    Mapel: t.subject || "",
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guru");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=daftar_guru.xlsx",
    },
  });
}
