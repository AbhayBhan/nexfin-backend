import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

type DbInstance = NeonHttpDatabase<typeof schema>;

let db: DbInstance;

export const connectDB = () => {
  const client = neon(process.env.DATABASE_URL as string);
  db = drizzle(client, { schema, logger: true });
};

export { db };
