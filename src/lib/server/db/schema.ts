import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, decimal, text, datetime } from 'drizzle-orm/mysql-core';

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
	name: varchar('name', { length: 50 }).unique()
});
export const category = mysqlTable('category', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).unique()
});
export const unit = mysqlTable('unit', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).unique()
});

export const product = mysqlTable('product', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull().unique(),
	brand_id: int('brand_id').references(() => brand.id),
	category_id: int('category_id').references(() => category.id).notNull(),
	unit_id: int('unit_id').references(() => unit.id).notNull(),
	price: decimal('price', { precision: 10, scale: 2 }).notNull().default("0"),
	stock: int('stock').notNull().default(0),
	barcode: varchar('barcode', { length: 255 }).unique(),
	description: text('description'),
});

export const productRelations = relations(product, ({ one }) => ({
	unit: one(unit, {
		references: [unit.id],
		fields: [product.unit_id]
	}),
	brand: one(brand, {
		references: [brand.id],
		fields: [product.brand_id]
	}),
	category: one(category, {
		references: [category.id],
		fields: [product.category_id]
	}),
}));