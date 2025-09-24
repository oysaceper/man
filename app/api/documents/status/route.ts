import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Cek status kelengkapan dokumen siswa
// ?studentId=... (atau bisa juga ?nisn=...)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) {
    return NextResponse.json({ error: "studentId wajib diisi" }, { status: 400 });
  }
  // Dokumen yang wajib: akte, kk, ijazah
  const required = ["akte", "kk", "ijazah"];
  const docs = await db.select().from(schema.documents).where(eq(schema.documents.studentId, studentId));
  const status: Record<string, boolean> = {};
  for (const type of required) {
    status[type] = !!docs.find((d) => d.type === type);
  }
  status.lengkap = required.every((type) => status[type]);
  return NextResponse.json(status);
}
