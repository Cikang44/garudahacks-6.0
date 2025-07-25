import { drizzle } from 'drizzle-orm/neon-http';
import { assert } from 'console';
import * as schema from './schema';

assert(process.env.DATABASE_URL, 'DATABASE_URL must be set in the environment variables');
export const db = drizzle(process.env.DATABASE_URL ?? "", { schema });