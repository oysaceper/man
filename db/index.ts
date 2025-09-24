import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as auth from './schema/auth';
import * as school from './schema/school';

export const db = drizzle(process.env.DATABASE_URL!);

// Export all schema tables
export { auth, school };