import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, decimal, text, datetime } from 'drizzle-orm/mysql-core';
export const user = mysqlTable('user', {
	id: varchar({ length: 255 }).primaryKey(),
	username: varchar({ length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	address: varchar({ length: 255 }),
	contact: varchar({ length: 20 }),
	role: varchar({ length: 20 }).notNull().default('admin').$type<'user' | 'admin' | 'cashier'>(),
	created_at: datetime(),
});

export const session = mysqlTable('session', {
	id: varchar({ length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;


export const brand = mysqlTable('brand', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 50 }).unique()
});
export const category = mysqlTable('category', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 50 }).unique()
});
export const unit = mysqlTable('unit', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 50 }).unique()
});

export const product = mysqlTable('product', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 255 }).notNull().unique(),
	brand_id: int().references(() => brand.id),
	category_id: int().references(() => category.id).notNull(),
	unit_id: int().references(() => unit.id).notNull(),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	stock: int().notNull().default(0),
	barcode: varchar({ length: 255 }).unique(),
	description: text(),
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

export const customer = mysqlTable('customer', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 50 }),
	picture: varchar({ length: 255 }),
	address: varchar({ length: 100 }),
	contact: varchar({ length: 20 })
});
export const supplier = mysqlTable('supplier', {
	id: int().primaryKey().autoincrement(),
	name: varchar({ length: 50 }),
	contact: varchar({ length: 255 }),
	address: varchar({ length: 100 }),
	company_name: varchar({ length: 20 })
});

export const productOrder = mysqlTable('product_order', {
	id: int().primaryKey().autoincrement(),
	product_id: int().references(() => product.id).notNull(),
	unit_id: int().references(() => unit.id).notNull(),
	quantity: int().notNull().default(1),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	total: decimal({ precision: 10, scale: 2 }).notNull(),
	disc_value: decimal({ precision: 10, scale: 2 }),
	invoice_id: int().references(() => invoice.id).notNull(),
	disc_pecent: int(),
});
export const productOrderRelations = relations(productOrder, ({ one }) => ({
	product: one(product, {
		references: [product.id],
		fields: [productOrder.product_id]
	}),
	unit: one(unit, {
		references: [unit.id],
		fields: [productOrder.unit_id]
	}),
	invoice: one(invoice, {
		references: [invoice.id],
		fields: [productOrder.invoice_id]
	}),
}));

export const invoice = mysqlTable('invoice', {
	id: int().primaryKey().autoincrement(),
	customer_id: int().references(() => customer.id),
	status: varchar({ length: 20 }).notNull().default('pending').$type<'paid' | "pending" | "partial">(),
	amount: decimal({ precision: 10, scale: 2 }).notNull(),
	disc_value: decimal({ precision: 10, scale: 2 }),
	disc_pecent: int(),
	total: decimal({ precision: 10, scale: 2 }).notNull(),
	amount_paid: decimal({ precision: 10, scale: 2 }).notNull(),
	return: decimal({ precision: 10, scale: 2 }),
	created_at: datetime().notNull(),
});
export const invoiceRelations = relations(invoice, ({ one, many }) => ({
	customer: one(customer, {
		references: [customer.id],
		fields: [invoice.customer_id]
	}),
	productOrders: many(productOrder)
}));
