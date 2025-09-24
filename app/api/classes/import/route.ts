import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const runtime = "edge";

// POST: Import kelas dari file Excel (.xlsx)
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "File Excel tidak ditemukan" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  let imported = 0;
  for (const rowRaw of rows) {
    const row = rowRaw as Record<string, any>;
    const name = row["Nama Kelas"]?.toString();
    const year = parseInt(row["Tahun"]);
    const level = row["Tingkat"]?.toString();
    if (!name || !year || !level) continue;
    // Generate id kelas
    const id = crypto.randomUUID();
    await db.insert(schema.classes).values({ id, name, year, level }).returning();
    imported++;
  }
  return NextResponse.json({ imported });
}
