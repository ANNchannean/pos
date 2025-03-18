import { and, between, eq } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';
import { db } from './db';
import { inventory, invoice, product } from './db/schema';

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

export async function calulatorStock(invoice_id: number, type: 'update' | 'create') {
	const get_invoice = await db.query.invoice.findFirst({
		where: eq(invoice.id, invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							subUnit: true,
							inventory: {
								where: and(eq(inventory.is_outstock, false), eq(inventory.is_close_inventory, false))
							},
						}
					}
				}
			}
		}
	})
	if (!get_invoice) return
	for (const e of get_invoice.productOrders) {
		const inventories = e.product.inventory
		let qty_catch_stock = e.quantity
		const found_unit = e.product?.subUnit?.find((e) => e.unit_id === e.unit_id)
		if (found_unit) {
			qty_catch_stock = e.quantity * found_unit.qty_per_unit
		}

		for (let index = 0; index < inventories.length; index++) {
			const element = inventories[index];
			if (element.is_count_stock) {
				if (element.qty_available) {
					if (element.qty_available >= qty_catch_stock) {
						await db.update(inventory).set({
							qty_available: element.qty_available - qty_catch_stock
						}).where(eq(inventory.id, element.id))
						break
					}
				}
			}

		}
	}

}
