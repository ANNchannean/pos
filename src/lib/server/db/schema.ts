import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/mysql-core';
export const user = t.mysqlTable('user', {
	id: t.varchar({ length: 255 }).primaryKey(),
	username: t.varchar({ length: 32 }).notNull().unique(),
	passwordHash: t.varchar('password_hash', { length: 255 }).notNull(),
	address: t.varchar({ length: 255 }),
	contact: t.varchar({ length: 20 }),
	role: t.varchar({ length: 20 }).notNull().default('admin').$type<'user' | 'admin' | 'cashier'>(),
	created_at: t.datetime()
});
export const companyInfo = t.mysqlTable('company_info', {
	id: t.int().primaryKey().autoincrement(),
	name_khmer: t.varchar({ length: 255 }).notNull(),
	name_english: t.varchar({ length: 255 }).notNull(),
	address: t.varchar({ length: 255 }),
	contact: t.varchar({ length: 255 }),
	description: t.text(),
	logo: t.varchar({ length: 255 }),
	qr: t.varchar({ length: 255 }),
	note: t.text(),
	created_at: t.datetime({ mode: 'string' }).notNull()
});

export const session = t.mysqlTable('session', {
	id: t.varchar({ length: 255 }).primaryKey(),
	userId: t
		.varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: t.datetime('expires_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export const brand = t.mysqlTable('brand', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 50 }).unique()
});
export const category = t.mysqlTable('category', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 50 }).unique()
});
export const unit = t.mysqlTable('unit', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 50 }).unique()
});

export const product = t.mysqlTable('product', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 255 }).notNull(),
	model: t.varchar({ length: 255 }).notNull(),
	brand_id: t.int().references(() => brand.id),
	category_id: t
		.int()
		.references(() => category.id)
		.notNull(),
	unit_id: t
		.int()
		.references(() => unit.id)
		.notNull(), // ប្រើលក់រាយ
	price: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	condition: t.varchar({ length: 10 }),
	barcode: t.varchar({ length: 255 }),
	description: t.text(),
	image: t.varchar({ length: 255 })
});

export const productRelations = relations(product, ({ one, many }) => ({
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
	inventory: many(inventory),
	subUnit: many(subUnit)
}));

export const customer = t.mysqlTable('customer', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 100 }),
	picture: t.varchar({ length: 255 }),
	address: t.varchar({ length: 255 }),
	contact: t.varchar({ length: 50 }),
	gender: t.varchar({ length: 20 })
});
export const supplier = t.mysqlTable('supplier', {
	id: t.int().primaryKey().autoincrement(),
	name: t.varchar({ length: 50 }),
	contact: t.varchar({ length: 255 }),
	address: t.varchar({ length: 100 }),
	company_name: t.varchar({ length: 20 })
});

export const productOrder = t.mysqlTable('product_order', {
	id: t.int().primaryKey().autoincrement(),
	product_id: t
		.int()
		.references(() => product.id, { onDelete: 'restrict', onUpdate: 'cascade' })
		.notNull(),
	unit_id: t
		.int()
		.references(() => unit.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	quantity: t.int().notNull().default(1),
	price: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	total: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	amount: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	discount: t.varchar({ length: 20 }),
	invoice_id: t
		.int()
		.references(() => invoice.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull()
});

export type ProductOrder = typeof productOrder.$inferSelect;
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
	})
}));

export const invoice = t.mysqlTable('invoice', {
	id: t.int().primaryKey().autoincrement(),
	customer_id: t.int().references(() => customer.id),
	status: t
		.varchar({ length: 20 })
		.notNull()
		.default('pending')
		.$type<'paid' | 'debt' | 'pending'>(),
	amount: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	discount: t.varchar({ length: 20 }),
	total: t.decimal({ precision: 10, scale: 2 }).notNull().$type<number>(),
	amount_paid: t.decimal({ precision: 10, scale: 2 }).$type<number>(),
	created_at: t.datetime({ mode: 'string' }).notNull(),
	seller_id: t
		.varchar({ length: 255 })
		.references(() => user.id)
		.notNull(),
	note: t.text()
});
export const invoiceRelations = relations(invoice, ({ one, many }) => ({
	customer: one(customer, {
		references: [customer.id],
		fields: [invoice.customer_id]
	}),
	seller: one(user, {
		references: [user.id],
		fields: [invoice.seller_id]
	}),
	productOrders: many(productOrder)
}));

export const exspend = t.mysqlTable('exspend', {
	id: t.int().primaryKey().autoincrement(),
	amount: t.decimal({ precision: 10, scale: 2 }).$type<number>(),
	reason: t.text(),
	created_at: t.datetime({ mode: 'string' }).notNull(),
	user_id: t
		.varchar({ length: 255 })
		.references(() => user.id)
		.notNull()
});
export const exspendRelations = relations(exspend, ({ one, many }) => ({
	user: one(user, {
		fields: [exspend.user_id],
		references: [user.id]
	}),
	inventory: many(inventory)
}));

export const inventory = t.mysqlTable('inventory', {
	id: t.int().primaryKey().autoincrement(),
	product_id: t
		.int()
		.references(() => product.id)
		.notNull(),
	cost_unit_id: t.int().references(() => unit.id, { onDelete: 'set null' }),
	exspend_id: t.int().references(() => exspend.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	}),
	cost: t.decimal({ precision: 18, scale: 2 }).$type<number>(),
	total_expense: t.decimal({ precision: 18, scale: 2 }).$type<number>(),
	is_outstock: t.boolean().default(false).notNull(),
	is_expire: t.boolean().default(false).notNull(),
	is_close_inventory: t.boolean().default(false).notNull(),
	qty_bought: t.int().default(0),
	qty_available: t.int().default(0),
	old_qty_available: t.int().default(0),
	old_qty_price: t.decimal({ precision: 18, scale: 2 }).$type<number>(),
	is_count_stock: t.boolean().default(false).notNull(),
	datetime_expire: t.datetime({ mode: 'string' }),
	datetime_buy: t.datetime({ mode: 'string' }),
	datetime_outstock: t.datetime({ mode: 'string' })
});
export const inventoryRelations = relations(inventory, ({ one }) => ({
	product: one(product, {
		fields: [inventory.product_id],
		references: [product.id]
	}),
	constUnit: one(unit, {
		fields: [inventory.cost_unit_id],
		references: [unit.id]
	}),
	exspend: one(exspend, {
		fields: [inventory.exspend_id],
		references: [exspend.id]
	})
}));

export const subUnit = t.mysqlTable('sub_unit', {
	id: t.int().primaryKey().autoincrement(),
	qty_per_unit: t.int().notNull().default(0),
	price: t.decimal({ precision: 18, scale: 2 }).$type<number>(),
	unit_id: t
		.int()
		.references(() => unit.id)
		.notNull(),
	product_id: t.int().references(() => product.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});
export const subUnitRelations = relations(subUnit, ({ one }) => ({
	unit: one(unit, {
		fields: [subUnit.unit_id],
		references: [unit.id]
	}),
	product: one(product, {
		fields: [subUnit.product_id],
		references: [product.id]
	})
}));
