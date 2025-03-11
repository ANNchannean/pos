import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import { exspend, inventory, product } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { localFormat } from '$lib/client/helper';

// រុញទិន្នន័យទៅ Client  តាមរយៈ Load Function
export const load = (async ({ url }) => {
	const q = url.searchParams.get('q') || '';
	const product_id = url.searchParams.get('product_id') || '';
	const inventory_id = url.searchParams.get('inventory_id') || '';
	const exspend_id = url.searchParams.get('exspend_id') || '';
	const get_inventory = await db.query.inventory.findFirst({
		where: eq(inventory.id, +inventory_id)
	});
	const get_products = await db.query.product.findMany({
		where: like(product.name, `%${q}%`),
		limit: 200
	});
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id)),
		with: {
			subUnit: {
				with: {
					unit: true
				}
			},
			unit: true
		}
	});
	const get_exspend = await db.query.exspend.findFirst({
		where: eq(exspend.id, +exspend_id),
		with: {
			inventory: {
				with: {
					product: {
						with: {
							brand: true,
							category: true,
							subUnit: {
								with: {
									unit: true
								}
							},
							unit: true
						}
					},
					constUnit: true
				}
			}
		}
	});
	return {
		get_product,
		get_products,
		get_exspend,
		get_inventory
	};
}) satisfies PageServerLoad;

// ទទូលសំណើរមកពីClient តាមរយៈ Actions Form
export const actions: Actions = {
	create_inventory: async ({ request, locals }) => {
		const user_id = String(locals.user?.id);
		const body = await request.formData();
		const { cost, qty_bought, cost_unit_id, count_stock, product_id, exspend_id, inventory_id } =
			Object.fromEntries(body) as Record<string, string>;
		if (!cost || !qty_bought || !product_id || !cost_unit_id || !count_stock)
			return fail(400, { validErr: true });
		const get_product = await db.query.product.findFirst({
			where: eq(product.id, +product_id),
			with: {
				subUnit: true
			}
		});
		let qty_available = +qty_bought;
		const adjust_unit = get_product?.subUnit.find((e) => e.unit_id === +cost_unit_id);
		if (adjust_unit) {
			qty_available = +qty_bought * adjust_unit.qty_per_unit;
		}
		if (!exspend_id) {
			const create_exspend: { id: number }[] = await db
				.insert(exspend)
				.values({
					reason: 'INVENTORY',
					created_at: localFormat.datetime(new Date()),
					user_id: user_id
				})
				.$returningId();
			await createInventory({
				cost,
				cost_unit_id,
				count_stock,
				datetime_buy: localFormat.datetime(new Date()),
				exspend_id: create_exspend[0].id,
				product_id,
				qty_available,
				qty_bought,
				inventory_id: inventory_id ? +inventory_id : null
			});
			redirect(300, `/dash/inventory?exspend_id=${create_exspend[0].id}`);
		}

		if (exspend_id) {
			await createInventory({
				cost,
				cost_unit_id,
				count_stock,
				datetime_buy: localFormat.datetime(new Date()),
				exspend_id: +exspend_id,
				product_id,
				qty_available,
				qty_bought,
				inventory_id: inventory_id ? +inventory_id : null
			});
			redirect(300, `/dash/inventory?exspend_id=${exspend_id}`);
		}
	},
	delete: async ({ request }) => {
		const body = await request.formData();
		const inventory_id = body.get('inventory_id');
		const exspend_id = body.get('exspend_id');
		if (!inventory_id || !exspend_id) return fail(400, { validDelete: true });
		await db.delete(inventory).where(eq(inventory.id, +inventory_id));
		const get_exspend = await db.query.exspend.findFirst({
			where: eq(exspend.id, +exspend_id),
			with: {
				inventory: true
			}
		});
		await db.update(exspend).set({
			amount: get_exspend?.inventory.reduce((s, e) => s + Number(e.total_expense) || 0, 0)
		});
	}
};
interface TCreateINV {
	qty_bought: string;
	cost: string;
	cost_unit_id: string;
	count_stock: string;
	product_id: string;
	exspend_id: number;
	qty_available: number;
	datetime_buy: string;
	inventory_id: number | null;
}
async function createInventory(param: TCreateINV) {
	try {
		if (param.inventory_id) {
			await db
				.update(inventory)
				.set({
					product_id: +param.product_id,
					cost: +param.cost,
					cost_unit_id: +param.cost_unit_id,
					qty_bought: +param.qty_bought,
					qty_available: +param.qty_available,
					exspend_id: +param.exspend_id,
					is_count_stock: param.count_stock === 'true' ? true : false,
					datetime_buy: param.datetime_buy,
					total_expense: +param.qty_bought * +param.cost
				})
				.where(eq(inventory.id, +param.inventory_id));
		} else {
			await db.insert(inventory).values({
				product_id: +param.product_id,
				cost: +param.cost,
				cost_unit_id: +param.cost_unit_id,
				qty_bought: +param.qty_bought,
				qty_available: +param.qty_available,
				exspend_id: +param.exspend_id,
				is_count_stock: param.count_stock === 'count_stock' ? true : false,
				datetime_buy: param.datetime_buy,
				total_expense: +param.qty_bought * +param.cost
			});
		}
		const get_exspend = await db.query.exspend.findFirst({
			where: eq(exspend.id, param.exspend_id),
			with: {
				inventory: true
			}
		});
		await db.update(exspend).set({
			amount: get_exspend?.inventory.reduce((s, e) => s + Number(e.total_expense) || 0, 0)
		});
	} catch (error) {
		console.log(error);
		return fail(400, { serverErr: true });
	}
}
