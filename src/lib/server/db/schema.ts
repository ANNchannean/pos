import { relations } from 'drizzle-orm';
import { mysqlTable, int, varchar, decimal, text, datetime } from 'drizzle-orm/mysql-core';
export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull(),
	address: varchar('address', { length: 255 }),
	contact: varchar('contact', { length: 20 }),
	role: varchar('role', { length: 20 }).notNull().default('admin').$type<'user' | 'admin' | 'cashier'>(),
	created_at: datetime('created_at'),
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

export const customer = mysqlTable('customer', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }),
	picture: varchar('picture', { length: 255 }),
	address: varchar('address', { length: 100 }),
	contact: varchar('contact', { length: 20 })
});
export const supplier = mysqlTable('supplier', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }),
	contact: varchar('contact', { length: 255 }),
	address: varchar('address', { length: 100 }),
	company_name: varchar('company_name', { length: 20 })
});

export const productOrder = mysqlTable('product_order', {
	id: int('id').primaryKey().autoincrement(),
	product_id: int('product_id').references(() => product.id).notNull(),
	unit_id: int('unit_id').references(() => unit.id).notNull(),
	quantity: int('quantity').notNull().default(1),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
	disc_value: decimal('discount', { precision: 10, scale: 2 }),
	invoice_id: int('invoice_id').references(() => invoice.id).notNull(),
	disc_pecent: int('discount_percent'),
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
	id: int('id').primaryKey().autoincrement(),
	customer_id: int('customer_id').references(() => customer.id),
	status: varchar('status', { length: 20 }).notNull().default('pending').$type<'paid' | "pending" | "partial">(),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	disc_value: decimal('discount', { precision: 10, scale: 2 }),
	disc_pecent: int('discount_percent'),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
	amount_paid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull().default("0"),
	return: decimal('return', { precision: 10, scale: 2 }),
	created_at: datetime('created_at').notNull(),
});
export const invoiceRelations = relations(invoice, ({ one, many }) => ({
	customer: one(customer, {
		references: [customer.id],
		fields: [invoice.customer_id]
	}),
	productOrders: many(productOrder)
}));
