import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '$env/dynamic/private';
import * as schemas from './schema';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = await mysql.createConnection(env.DATABASE_URL);

export const db = drizzle({
	mode: 'default',
	schema: schemas,
	connection: {
		uri: env.DATABASE_URL
	}
});
