import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let db;  

export const connectDB = () => {
  const client = neon(process.env.DATABASE_URL as string);
  db = drizzle(client, { schema, logger: true });
}

export {db};
