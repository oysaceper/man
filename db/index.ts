import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as coreSchema from './schema/core';
import * as authSchema from './schema/auth';

export const db = drizzle(process.env.DATABASE_URL!);
export const schema = {
	...coreSchema,
	...authSchema,
};