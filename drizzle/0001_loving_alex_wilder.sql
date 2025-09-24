CREATE TABLE "academic_year" (
	"id" text PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "academic_year_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"added_by_id" text NOT NULL,
	"tahun" text NOT NULL,
	"nama_lomba" text NOT NULL,
	"penyelenggara_lomba" text NOT NULL,
	"tingkat_lomba" text NOT NULL,
	"bidang_lomba" text NOT NULL,
	"capaian_lomba" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"class_id" text NOT NULL,
	"date" date NOT NULL,
	"session" text NOT NULL,
	"status" text DEFAULT 'hadir' NOT NULL,
	"recorded_by_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"academic_year_id" text NOT NULL,
	"grade" text NOT NULL,
	"class_name" text NOT NULL,
	"home_teacher_id" text,
	"attendance_officer_1_id" text,
	"attendance_officer_2_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counseling_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"counseling_note_id" text NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL,
	"uploaded_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counseling_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"counselor_id" text NOT NULL,
	"notes" text NOT NULL,
	"follow_up_needed" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fathers" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"no_kk" text,
	"nama_lengkap" text,
	"nik" text,
	"tempat_lahir" text,
	"tanggal_lahir" date,
	"status" text,
	"pendidikan_terakhir" text,
	"pekerjaan_utama" text,
	"domisili" text,
	"no_handphone" text,
	"penghasilan_per_bulan" numeric(15, 2),
	"alamat" text,
	"status_tempat_tinggal" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mothers" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"no_kk" text,
	"nama_lengkap" text,
	"nik" text,
	"tempat_lahir" text,
	"tanggal_lahir" date,
	"status" text,
	"pendidikan_terakhir" text,
	"pekerjaan_utama" text,
	"domisili" text,
	"no_handphone" text,
	"penghasilan_per_bulan" numeric(15, 2),
	"alamat" text,
	"status_tempat_tinggal" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"uploaded_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nisn" text NOT NULL,
	"nism" text,
	"nik" text,
	"kip" text,
	"asal_sekolah" text,
	"tempat_lahir" text,
	"tanggal_lahir" date,
	"jenis_kelamin" text,
	"agama" text,
	"jumlah_saudara" integer,
	"anak_ke" integer,
	"hobi" text,
	"cita_cita" text,
	"no_handphone" text,
	"email_siswa" text,
	"alamat_rumah" text,
	"jarak_tempuh_ke_sekolah" text,
	"waktu_tempuh" text,
	"transportasi_ke_sekolah" text,
	"class_id" text,
	"documents_complete" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "students_nisn_unique" UNIQUE("nisn")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nip" text NOT NULL,
	"mapel" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "teachers_nip_unique" UNIQUE("nip")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'siswa' NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_added_by_id_user_id_fk" FOREIGN KEY ("added_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_recorded_by_id_user_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_year_id_academic_year_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_year"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_home_teacher_id_user_id_fk" FOREIGN KEY ("home_teacher_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_attendance_officer_1_id_user_id_fk" FOREIGN KEY ("attendance_officer_1_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_attendance_officer_2_id_user_id_fk" FOREIGN KEY ("attendance_officer_2_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_documents" ADD CONSTRAINT "counseling_documents_counseling_note_id_counseling_notes_id_fk" FOREIGN KEY ("counseling_note_id") REFERENCES "public"."counseling_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_notes" ADD CONSTRAINT "counseling_notes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_notes" ADD CONSTRAINT "counseling_notes_counselor_id_user_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fathers" ADD CONSTRAINT "fathers_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mothers" ADD CONSTRAINT "mothers_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");