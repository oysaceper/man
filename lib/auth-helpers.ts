import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { students, teachers } from "@/db/schema/school";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserWithRole {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: string;
  image?: string;
}

/**
 * Authenticate user with username and password
 * Admin: username = 'admin', password = '123456'
 * Student: username = NISN, password = NISN
 * Teacher/Guru BK: username = NIP, password = NIP
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<UserWithRole | null> {
  const { username, password } = credentials;

  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (existingUser.length === 0) {
      return null;
    }

    const foundUser = existingUser[0];

    // For admin user
    if (foundUser.role === 'admin' && username === 'admin' && password === '123456') {
      return {
        id: foundUser.id,
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email || undefined,
        role: foundUser.role,
        image: foundUser.image || undefined,
      };
    }

    // For students: username = NISN, password = NISN
    if (foundUser.role === 'siswa' || foundUser.role === 'petugas_absen') {
      const student = await db
        .select()
        .from(students)
        .where(eq(students.userId, foundUser.id))
        .limit(1);

      if (student.length > 0 && student[0].nisn === username && password === username) {
        return {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          email: foundUser.email || undefined,
          role: foundUser.role,
          image: foundUser.image || undefined,
        };
      }
    }

    // For teachers and guru BK: username = NIP, password = NIP
    if (foundUser.role === 'guru' || foundUser.role === 'guru_bk') {
      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.userId, foundUser.id))
        .limit(1);

      if (teacher.length > 0 && teacher[0].nip === username && password === username) {
        return {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          email: foundUser.email || undefined,
          role: foundUser.role,
          image: foundUser.image || undefined,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Create a new user with role-specific logic
 */
export async function createUserWithRole(userData: {
  name: string;
  username: string;
  role: string;
  email?: string;
  additionalData?: any;
}): Promise<string> {
  // Generate user ID
  const userId = crypto.randomUUID();

  // Create user
  await db.insert(user).values({
    id: userId,
    name: userData.name,
    username: userData.username,
    email: userData.email,
    role: userData.role as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return userId;
}

/**
 * Hash password (for future use if needed)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify password (for future use if needed)
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}