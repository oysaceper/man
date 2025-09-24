import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(), // admin, guru_bk, guru, siswa, petugas_absen
});

export const students = pgTable("students", {
  id: text("id").primaryKey(), // UUID
  nisn: text("nisn").notNull().unique(),
  name: text("name").notNull(),
  classId: text("class_id"),
  // ...biodata fields
});

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(), // UUID
  nip: text("nip").notNull().unique(),
  name: text("name").notNull(),
  subject: text("subject"),
});

export const classes = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  level: text("level").notNull(), // X, XI, XII
  homeroomTeacherId: text("homeroom_teacher_id"),
  attendanceOfficer1Id: text("attendance_officer1_id"),
  attendanceOfficer2Id: text("attendance_officer2_id"),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(), // NISN/NIP/username
  password: text("password").notNull(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  refId: text("ref_id"), // id siswa/guru/admin
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull(),
  studentId: text("student_id").notNull(),
  date: timestamp("date").notNull(),
  session: text("session").notNull(), // pagi, istirahat1, istirahat2
  status: text("status").notNull(), // hadir, sakit, izin, alpa
});

export const counselingNotes = pgTable("counseling_notes", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  teacherId: text("teacher_id").notNull(),
  note: text("note").notNull(),
  document: text("document"),
  photo: text("photo"),
  createdAt: timestamp("created_at").notNull(),
});

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  year: integer("year").notNull(),
  competitionName: text("competition_name").notNull(),
  organizer: text("organizer").notNull(),
  level: text("level").notNull(),
  field: text("field").notNull(),
  achievement: text("achievement").notNull(),
});

export const parents = pgTable("parents", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  fatherName: text("father_name"),
  motherName: text("mother_name"),
  // ...other parent fields
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  type: text("type").notNull(), // akte, kk, ijazah
  file: text("file").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull(),
});
