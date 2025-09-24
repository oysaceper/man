import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { eq } from "drizzle-orm";

export const runtime = "edge";

// POST: Import guru dari file Excel (.xlsx)
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
    const nip = row["NIP"]?.toString();
    const name = row["Nama"]?.toString();
    const subject = row["Mapel"]?.toString() || "";
    if (!nip || !name) continue;
    // Cek NIP unik
    const exist = await db.select().from(schema.teachers).where(eq(schema.teachers.nip, nip)).limit(1);
    if (exist[0]) continue;
    // Generate id guru
    const id = crypto.randomUUID();
    // Insert teacher
    const inserted = await db.insert(schema.teachers).values({ id, nip, name, subject }).returning();
    // Otomatis buat user guru
    await db.insert(schema.users).values({
      id,
      username: nip,
      password: nip,
      roleId: 3, // role guru
      refId: id,
    });
    imported++;
  }
  return NextResponse.json({ imported });
}
