import 'dotenv/config';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { academicYear, classes, students, teachers } from '@/db/schema/school';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const adminId = crypto.randomUUID();
    
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(user)
      .where(eq(user.username, 'admin'))
      .limit(1);

    if (existingAdmin.length === 0) {
      await db.insert(user).values({
        id: adminId,
        name: 'Administrator',
        username: 'admin',
        email: 'admin@man2ponorogo.sch.id',
        role: 'admin',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create academic year
    const currentYear = new Date().getFullYear();
    const academicYearName = `${currentYear}/${currentYear + 1}`;
    const academicYearId = crypto.randomUUID();

    const existingYear = await db
      .select()
      .from(academicYear)
      .where(eq(academicYear.year, academicYearName))
      .limit(1);

    if (existingYear.length === 0) {
      await db.insert(academicYear).values({
        id: academicYearId,
        year: academicYearName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Academic year created');

      // Create sample classes
      const sampleClasses = [
        { grade: 'X', className: 'A' },
        { grade: 'X', className: 'B' },
        { grade: 'XI', className: 'IPA 1' },
        { grade: 'XI', className: 'IPS 1' },
        { grade: 'XII', className: 'IPA 1' },
        { grade: 'XII', className: 'IPS 1' },
      ];

      for (const cls of sampleClasses) {
        const classId = crypto.randomUUID();
        await db.insert(classes).values({
          id: classId,
          academicYearId,
          grade: cls.grade as any,
          className: cls.className,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log('✅ Sample classes created');
    } else {
      console.log('ℹ️  Academic year already exists');
    }

    // Create sample Guru BK user
    const guruBkId = crypto.randomUUID();
    const existingGuruBk = await db
      .select()
      .from(user)
      .where(eq(user.username, '199901012020121001'))
      .limit(1);

    if (existingGuruBk.length === 0) {
      await db.insert(user).values({
        id: guruBkId,
        name: 'Dra. Siti Aminah, M.Pd',
        username: '199901012020121001',
        email: 'siti.aminah@man2ponorogo.sch.id',
        role: 'guru_bk',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.insert(teachers).values({
        id: crypto.randomUUID(),
        userId: guruBkId,
        nip: '199901012020121001',
        mapel: 'Bimbingan Konseling',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Sample Guru BK created');
    }

    // Create sample Guru user
    const guruId = crypto.randomUUID();
    const existingGuru = await db
      .select()
      .from(user)
      .where(eq(user.username, '199801012019032001'))
      .limit(1);

    if (existingGuru.length === 0) {
      await db.insert(user).values({
        id: guruId,
        name: 'Ahmad Fauzi, S.Pd',
        username: '199801012019032001',
        email: 'ahmad.fauzi@man2ponorogo.sch.id',
        role: 'guru',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.insert(teachers).values({
        id: crypto.randomUUID(),
        userId: guruId,
        nip: '199801012019032001',
        mapel: 'Matematika',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Sample Guru created');
    }

    // Create sample student
    const studentId = crypto.randomUUID();
    const studentUserId = crypto.randomUUID();
    const existingStudent = await db
      .select()
      .from(user)
      .where(eq(user.username, '1234567890'))
      .limit(1);

    if (existingStudent.length === 0) {
      await db.insert(user).values({
        id: studentUserId,
        name: 'Budi Santoso',
        username: '1234567890',
        email: 'budi.santoso@student.man2ponorogo.sch.id',
        role: 'siswa',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.insert(students).values({
        id: studentId,
        userId: studentUserId,
        nisn: '1234567890',
        nism: '12345',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Sample student created');
    }

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: username=admin, password=123456');
    console.log('Guru BK: username=199901012020121001, password=199901012020121001');
    console.log('Guru: username=199801012019032001, password=199801012019032001');
    console.log('Siswa: username=1234567890, password=1234567890');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seed };