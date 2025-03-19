import { between, eq } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';
import { db } from './db';
import { inventory, invoice } from './db/schema';
import { localFormat } from '$lib/client/helper';

export function pagination(url: URL) {
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 20;
	const currenctPage = page || 1;
	const offset = limit * (currenctPage - 1);
	return {
		limit,
		offset
	};
}
export function betweenHelper(url: URL, datetimeColumn: MySqlColumn) {
	const start = url.searchParams.get('start');
	const end = url.searchParams.get('end');

	if (start && end) {
		return between(datetimeColumn, start, end);
	}
	return undefined;
}

export async function calulatorStock(invoice_id: number) {
	const get_invoice = await db.query.invoice.findFirst({
		where: eq(invoice.id, invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							subUnit: true,
							inventory: {
								where: eq(inventory.is_outstock, false),

							},
						}
					}
				}
			}
		}
	})
	if (!get_invoice) return
	// ដក់ស្តុកនីមួយក្នុង Product Order
	for (const e of get_invoice.productOrders) {
		const inventories = e.product.inventory
		let qty_catch_stock = e.quantity // បំបែកជាខ្នាតរាយបើសិនមាន subUnit
		const found_unit = e.product?.subUnit?.find((e) => e.unit_id === e.unit_id)
		if (found_unit) {
			qty_catch_stock = e.quantity * found_unit.qty_per_unit
		}

		// ដល់ស្តុកក្នុង Inventory ដែលមាន និង រាប់ស្ដុក
		for (let index = 0; index < inventories.length; index++) {
			const element = inventories[index];
			// ប្រសិនបើទំនិញរាប់ស្តុក ត្រូវដកស្តុក 
			// Loop គ្រាប់ Inventory ដែលមាន
			if (element.is_count_stock) {
				if (element.qty_available) {
					console.log(qty_catch_stock)
					if (element.qty_available > qty_catch_stock) {
						await db.update(inventory).set({
							qty_available: element.qty_available - qty_catch_stock
						}).where(eq(inventory.id, element.id))
						break
					}
					if (element.qty_available < qty_catch_stock) {
						qty_catch_stock = qty_catch_stock - element.qty_available
						await db.update(inventory).set({
							qty_available: 0,
							is_outstock: true,
							datetime_outstock: localFormat.datetime(new Date())
						}).where(eq(inventory.id, element.id))
					}
					if (element.qty_available === qty_catch_stock) {
						await db.update(inventory).set({
							qty_available: 0,
							is_outstock: true,
							datetime_outstock: localFormat.datetime(new Date())
						}).where(eq(inventory.id, element.id))
						break
					}
				}
			}

		}
	}

}
export async function calulatorUpdateStock(invoice_id: number) {
	const get_invoice = await db.query.invoice.findFirst({
		where: eq(invoice.id, invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							subUnit: true,
							inventory: {
								where: eq(inventory.is_outstock, false),
							},
						}
					}
				}
			}
		}
	})
	if (!get_invoice) return
	// ដក់ស្តុកនីមួយក្នុង Product Order
	for (const e of get_invoice.productOrders) {
		const inventories = e.product.inventory
		let qty_catch_stock = e.quantity // បំបែកជាខ្នាតរាយបើសិនមាន subUnit
		const found_unit = e.product?.subUnit?.find((e) => e.unit_id === e.unit_id)
		if (found_unit) {
			qty_catch_stock = e.quantity * found_unit.qty_per_unit
		}

		// ដល់ស្តុកក្នុង Inventory ដែលមាន និង រាប់ស្ដុក
		for (let index = 0; index < inventories.length; index++) {
			const element = inventories[index];
			// ប្រសិនបើទំនិញរាប់ស្តុក ត្រូវដកស្តុក 
			// Loop គ្រាប់ Inventory ដែលមាន
			if (element.is_count_stock) {
				if (element.qty_available) {
					await db.update(inventory).set({
						qty_available: element.qty_available + qty_catch_stock
					}).where(eq(inventory.id, element.id))
					break

				}
			}

		}
		if (!inventories.length) {
			const get_inventory = await db.query.inventory.findFirst({
				where: eq(inventory.product_id, e.product_id)
			})
			if (get_inventory) {
				await db.update(inventory).set({
					qty_available: qty_catch_stock,
					is_outstock: false,
					datetime_outstock: null
				}).where(eq(inventory.id, get_inventory?.id))
			}
		}
	}

}
