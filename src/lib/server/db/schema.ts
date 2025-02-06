import { mysqlTable, serial, text, int, varchar, datetime } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	age: int('age'),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull()
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;


export const brand = mysqlTable('brand', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 })
});

export const category = mysqlTable('category', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 })
});
