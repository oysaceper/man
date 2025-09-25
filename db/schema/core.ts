import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(), // admin, guru_bk, guru, siswa, petugas_absen
});

export const students = pgTable("students", {
  id: text("id").primaryKey(), // UUID
  nisn: text("nisn").notNull().unique(),
  nism: text("nism"),
  name: text("name").notNull(),
  classId: text("class_id").references(() => classes.id),
  
  // Biodata fields
  asalSekolah: text("asal_sekolah"),
  nik: text("nik"),
  kip: text("kip"),
  tempatLahir: text("tempat_lahir"),
  tanggalLahir: timestamp("tanggal_lahir"),
  jenisKelamin: text("jenis_kelamin"), // Laki-laki, Perempuan
  agama: text("agama"),
  jumlahSaudara: integer("jumlah_saudara"),
  anakKe: integer("anak_ke"),
  hobi: text("hobi"),
  citaCita: text("cita_cita"),
  noHandphone: text("no_handphone"),
  alamatEmail: text("alamat_email"),
  alamatRumah: text("alamat_rumah"),
  jarakTempuh: text("jarak_tempuh"),
  waktuTempuh: text("waktu_tempuh"),
  transportasi: text("transportasi"),
  
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(), // UUID
  nip: text("nip").notNull().unique(),
  name: text("name").notNull(),
  subject: text("subject"), // mata pelajaran
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const classes = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  level: text("level").notNull(), // X, XI, XII
  homeroomTeacherId: text("homeroom_teacher_id").references(() => teachers.id),
  attendanceOfficer1Id: text("attendance_officer1_id").references(() => students.id),
  attendanceOfficer2Id: text("attendance_officer2_id").references(() => students.id),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(), // NISN/NIP/username
  password: text("password").notNull(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  refId: text("ref_id"), // id siswa/guru/admin
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classes.id),
  studentId: text("student_id").notNull().references(() => students.id),
  date: timestamp("date").notNull(),
  session: text("session").notNull(), // pagi, istirahat1, istirahat2
  status: text("status").notNull(), // hadir, sakit, izin, alpa
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const counselingNotes = pgTable("counseling_notes", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id),
  teacherId: text("teacher_id").notNull().references(() => teachers.id),
  note: text("note").notNull(),
  document: text("document"),
  photo: text("photo"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id),
  year: integer("year").notNull(),
  competitionName: text("competition_name").notNull(),
  organizer: text("organizer").notNull(),
  level: text("level").notNull(),
  field: text("field").notNull(),
  achievement: text("achievement").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const parents = pgTable("parents", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  
  // Father's info
  fatherKK: text("father_kk"),
  fatherName: text("father_name"),
  fatherNIK: text("father_nik"),
  fatherTempatLahir: text("father_tempat_lahir"),
  fatherTanggalLahir: timestamp("father_tanggal_lahir"),
  fatherStatus: text("father_status"), // Masih Hidup, Meninggal
  fatherPendidikan: text("father_pendidikan"), // SD, SMP, SMA, S1, S2
  fatherPekerjaan: text("father_pekerjaan"),
  fatherDomisili: text("father_domisili"), // Dalam Negeri, Luar Negeri
  fatherHandphone: text("father_handphone"),
  fatherPenghasilan: integer("father_penghasilan"),
  fatherAlamat: text("father_alamat"),
  fatherStatusTinggal: text("father_status_tinggal"), // Milik Orang Tua, Milik Sendiri
  
  // Mother's info
  motherKK: text("mother_kk"),
  motherName: text("mother_name"),
  motherNIK: text("mother_nik"),
  motherTempatLahir: text("mother_tempat_lahir"),
  motherTanggalLahir: timestamp("mother_tanggal_lahir"),
  motherStatus: text("mother_status"), // Masih Hidup, Meninggal
  motherPendidikan: text("mother_pendidikan"), // SD, SMP, SMA, S1, S2
  motherPekerjaan: text("mother_pekerjaan"),
  motherDomisili: text("mother_domisili"), // Dalam Negeri, Luar Negeri
  motherHandphone: text("mother_handphone"),
  motherPenghasilan: integer("mother_penghasilan"),
  motherAlamat: text("mother_alamat"),
  motherStatusTinggal: text("mother_status_tinggal"), // Milik Orang Tua, Milik Sendiri
  
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => students.id),
  type: text("type").notNull(), // akte, kk, ijazah
  file: text("file").notNull(),
  uploadedAt: timestamp("uploaded_at").$defaultFn(() => new Date()),
});
