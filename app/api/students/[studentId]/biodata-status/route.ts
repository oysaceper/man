import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET: Check biodata completion status for a student
export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;

    // Get student data
    const student = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, studentId))
      .limit(1);

    if (!student[0]) {
      return NextResponse.json({ complete: false, missing: ["Student not found"] });
    }

    const s = student[0];
    const missing = [];

    // Check required fields
    if (!s.nik) missing.push("NIK");
    if (!s.tempatLahir) missing.push("Tempat Lahir");
    if (!s.tanggalLahir) missing.push("Tanggal Lahir");
    if (!s.jenisKelamin) missing.push("Jenis Kelamin");
    if (!s.agama) missing.push("Agama");
    if (!s.alamatRumah) missing.push("Alamat Rumah");
    if (!s.noHandphone) missing.push("No. Handphone");

    // Check parent data
    const parents = await db
      .select()
      .from(schema.parents)
      .where(eq(schema.parents.studentId, studentId))
      .limit(1);

    if (!parents[0]) {
      missing.push("Data Orang Tua");
    } else {
      const p = parents[0];
      if (!p.fatherName) missing.push("Nama Ayah");
      if (!p.motherName) missing.push("Nama Ibu");
    }

    // Check documents
    const documents = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.studentId, studentId));

    const docTypes = documents.map(d => d.type);
    if (!docTypes.includes("akte")) missing.push("Akte Kelahiran");
    if (!docTypes.includes("kk")) missing.push("Kartu Keluarga");
    if (!docTypes.includes("ijazah")) missing.push("Ijazah");

    const complete = missing.length === 0;

    return NextResponse.json({
      complete,
      missing,
      completionPercentage: Math.round(((15 - missing.length) / 15) * 100), // Assuming 15 required fields
    });
  } catch (error) {
    console.error("Error checking biodata status:", error);
    return NextResponse.json({ complete: false, missing: ["Error checking status"] });
  }
}