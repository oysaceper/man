CREATE TABLE "achievements" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"year" integer NOT NULL,
	"competition_name" text NOT NULL,
	"organizer" text NOT NULL,
	"level" text NOT NULL,
	"field" text NOT NULL,
	"achievement" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"student_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"session" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"level" text NOT NULL,
	"homeroom_teacher_id" text,
	"attendance_officer1_id" text,
	"attendance_officer2_id" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "counseling_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"note" text NOT NULL,
	"document" text,
	"photo" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"type" text NOT NULL,
	"file" text NOT NULL,
	"uploaded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"father_kk" text,
	"father_name" text,
	"father_nik" text,
	"father_tempat_lahir" text,
	"father_tanggal_lahir" timestamp,
	"father_status" text,
	"father_pendidikan" text,
	"father_pekerjaan" text,
	"father_domisili" text,
	"father_handphone" text,
	"father_penghasilan" integer,
	"father_alamat" text,
	"father_status_tinggal" text,
	"mother_kk" text,
	"mother_name" text,
	"mother_nik" text,
	"mother_tempat_lahir" text,
	"mother_tanggal_lahir" timestamp,
	"mother_status" text,
	"mother_pendidikan" text,
	"mother_pekerjaan" text,
	"mother_domisili" text,
	"mother_handphone" text,
	"mother_penghasilan" integer,
	"mother_alamat" text,
	"mother_status_tinggal" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"nisn" text NOT NULL,
	"nism" text,
	"name" text NOT NULL,
	"class_id" text,
	"asal_sekolah" text,
	"nik" text,
	"kip" text,
	"tempat_lahir" text,
	"tanggal_lahir" timestamp,
	"jenis_kelamin" text,
	"agama" text,
	"jumlah_saudara" integer,
	"anak_ke" integer,
	"hobi" text,
	"cita_cita" text,
	"no_handphone" text,
	"alamat_email" text,
	"alamat_rumah" text,
	"jarak_tempuh" text,
	"waktu_tempuh" text,
	"transportasi" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "students_nisn_unique" UNIQUE("nisn")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"nip" text NOT NULL,
	"name" text NOT NULL,
	"subject" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "teachers_nip_unique" UNIQUE("nip")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role_id" integer NOT NULL,
	"ref_id" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroom_teacher_id_teachers_id_fk" FOREIGN KEY ("homeroom_teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_attendance_officer1_id_students_id_fk" FOREIGN KEY ("attendance_officer1_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_attendance_officer2_id_students_id_fk" FOREIGN KEY ("attendance_officer2_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_notes" ADD CONSTRAINT "counseling_notes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_notes" ADD CONSTRAINT "counseling_notes_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;