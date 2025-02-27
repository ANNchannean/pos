import { db } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {  inventory, product } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const load = (async () => {
	const get_products = await db.query.product.findMany({
		with:{
			brand:true,
			category:true,
			unit:true,
			subUnit:{
				with:{
					unit:true
				}
			},
			inventory:{
				with:{
					constUnit:true
				},
				where:and(
					eq(inventory.is_outstock,false),
					eq(inventory.is_close_inventory,false),
				)
			}
		}
	});
	return {
		get_products
	};
}) satisfies PageServerLoad;



export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { product_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(product).where(eq(product.id, Number(product_id)));
	}
};
