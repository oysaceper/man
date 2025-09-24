import { pgTable, text, timestamp, integer, boolean, date, decimal } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Academic years and classes
export const academicYear = pgTable("academic_year", {
    id: text("id").primaryKey(),
    year: text("year").notNull().unique(), // e.g., "2024/2025"
    isActive: boolean("is_active").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

export const classes = pgTable("classes", {
    id: text("id").primaryKey(),
    academicYearId: text("academic_year_id").references(() => academicYear.id, { onDelete: "cascade" }).notNull(),
    grade: text("grade", { enum: ['X', 'XI', 'XII'] }).notNull(),
    className: text("class_name").notNull(), // e.g., "A", "B", "IPA 1"
    homeTeacherId: text("home_teacher_id").references(() => user.id),
    attendanceOfficer1Id: text("attendance_officer_1_id").references(() => user.id),
    attendanceOfficer2Id: text("attendance_officer_2_id").references(() => user.id),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Student information
export const students = pgTable("students", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    nisn: text("nisn").notNull().unique(),
    nism: text("nism"),
    nik: text("nik"),
    kip: text("kip"),
    asalSekolah: text("asal_sekolah"),
    tempatLahir: text("tempat_lahir"),
    tanggalLahir: date("tanggal_lahir"),
    jenisKelamin: text("jenis_kelamin", { enum: ['laki-laki', 'perempuan'] }),
    agama: text("agama"),
    jumlahSaudara: integer("jumlah_saudara"),
    anakKe: integer("anak_ke"),
    hobi: text("hobi"),
    citaCita: text("cita_cita"),
    noHandphone: text("no_handphone"),
    emailSiswa: text("email_siswa"),
    alamatRumah: text("alamat_rumah"),
    jarakTempuhKeSekolah: text("jarak_tempuh_ke_sekolah"),
    waktuTempuh: text("waktu_tempuh"),
    transportasiKeSekolah: text("transportasi_ke_sekolah"),
    classId: text("class_id").references(() => classes.id),
    documentsComplete: boolean("documents_complete").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Parent information (father)
export const fathers = pgTable("fathers", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    noKK: text("no_kk"),
    namaLengkap: text("nama_lengkap"),
    nik: text("nik"),
    tempatLahir: text("tempat_lahir"),
    tanggalLahir: date("tanggal_lahir"),
    status: text("status", { enum: ['masih_hidup', 'meninggal'] }),
    pendidikanTerakhir: text("pendidikan_terakhir", { enum: ['sd', 'smp', 'sma', 's1', 's2'] }),
    pekerjaanUtama: text("pekerjaan_utama"),
    domisili: text("domisili", { enum: ['dalam_negeri', 'luar_negeri'] }),
    noHandphone: text("no_handphone"),
    penghasilanPerBulan: decimal("penghasilan_per_bulan", { precision: 15, scale: 2 }),
    alamat: text("alamat"),
    statusTempatTinggal: text("status_tempat_tinggal", { enum: ['milik_orang_tua', 'milik_sendiri'] }),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Parent information (mother)
export const mothers = pgTable("mothers", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    noKK: text("no_kk"),
    namaLengkap: text("nama_lengkap"),
    nik: text("nik"),
    tempatLahir: text("tempat_lahir"),
    tanggalLahir: date("tanggal_lahir"),
    status: text("status", { enum: ['masih_hidup', 'meninggal'] }),
    pendidikanTerakhir: text("pendidikan_terakhir", { enum: ['sd', 'smp', 'sma', 's1', 's2'] }),
    pekerjaanUtama: text("pekerjaan_utama"),
    domisili: text("domisili", { enum: ['dalam_negeri', 'luar_negeri'] }),
    noHandphone: text("no_handphone"),
    penghasilanPerBulan: decimal("penghasilan_per_bulan", { precision: 15, scale: 2 }),
    alamat: text("alamat"),
    statusTempatTinggal: text("status_tempat_tinggal", { enum: ['milik_orang_tua', 'milik_sendiri'] }),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Student documents
export const studentDocuments = pgTable("student_documents", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    documentType: text("document_type", { enum: ['akte_kelahiran', 'kk_terbaru', 'ijazah_smp_mts'] }).notNull(),
    fileName: text("file_name").notNull(),
    filePath: text("file_path").notNull(),
    uploadedAt: timestamp("uploaded_at").$defaultFn(() => new Date()).notNull(),
});

// Teacher information
export const teachers = pgTable("teachers", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
    nip: text("nip").notNull().unique(),
    mapel: text("mapel"), // mata pelajaran
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Counseling notes
export const counselingNotes = pgTable("counseling_notes", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    counselorId: text("counselor_id").references(() => user.id).notNull(),
    notes: text("notes").notNull(),
    followUpNeeded: boolean("follow_up_needed").default(false),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Supporting documents for counseling
export const counselingDocuments = pgTable("counseling_documents", {
    id: text("id").primaryKey(),
    counselingNoteId: text("counseling_note_id").references(() => counselingNotes.id, { onDelete: "cascade" }).notNull(),
    fileName: text("file_name").notNull(),
    filePath: text("file_path").notNull(),
    fileType: text("file_type", { enum: ['document', 'photo'] }).notNull(),
    uploadedAt: timestamp("uploaded_at").$defaultFn(() => new Date()).notNull(),
});

// Student achievements
export const achievements = pgTable("achievements", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    addedById: text("added_by_id").references(() => user.id).notNull(),
    tahun: text("tahun").notNull(),
    namaLomba: text("nama_lomba").notNull(),
    penyelenggaraLomba: text("penyelenggara_lomba").notNull(),
    tingkatLomba: text("tingkat_lomba").notNull(), // tingkat, nasional, internasional, etc.
    bidangLomba: text("bidang_lomba").notNull(),
    capaianLomba: text("capaian_lomba").notNull(), // juara 1, 2, 3, finalis, etc.
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});

// Attendance records
export const attendance = pgTable("attendance", {
    id: text("id").primaryKey(),
    studentId: text("student_id").references(() => students.id, { onDelete: "cascade" }).notNull(),
    classId: text("class_id").references(() => classes.id, { onDelete: "cascade" }).notNull(),
    date: date("date").notNull(),
    session: text("session", { enum: ['pagi', 'istirahat_1', 'istirahat_2'] }).notNull(),
    status: text("status", { enum: ['hadir', 'sakit', 'izin', 'alpa'] }).notNull().default('hadir'),
    recordedById: text("recorded_by_id").references(() => user.id).notNull(),
    createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
    updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});