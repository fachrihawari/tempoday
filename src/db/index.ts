import { drizzle } from 'drizzle-orm/pglite';
import { IdbFs, PGlite } from '@electric-sql/pglite';
import * as schema from './schema';

const client = new PGlite({
  fs: new IdbFs('tempoday-db'),
})

export const db = drizzle(client, { schema: schema })
export type DB = typeof db;