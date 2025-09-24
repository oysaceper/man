import { db, schema } from "@/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { eq } from "drizzle-orm";

export const runtime = "edge";

// POST: Import siswa dari file Excel (.xlsx)
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "File Excel tidak ditemukan" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  let imported = 0;
  for (const row of rows) {
    const nisn = row["NISN"]?.toString();
    const name = row["Nama"]?.toString();
    if (!nisn || !name) continue;
    // Cek NISN unik
    const exist = await db.select().from(schema.students).where(eq(schema.students.nisn, nisn)).limit(1);
    if (exist[0]) continue;
    // Generate id siswa
    const id = crypto.randomUUID();
    // Insert student
    const inserted = await db.insert(schema.students).values({ id, nisn, name }).returning();
    // Otomatis buat user siswa
    await db.insert(schema.users).values({
      id,
      username: nisn,
      password: nisn,
      roleId: 4, // role siswa
      refId: id,
    });
    imported++;
  }
  return NextResponse.json({ imported });
}
