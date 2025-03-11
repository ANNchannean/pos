import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { inventory, product } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const product_id = url.searchParams.get('product_id');
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id)),
		with: {
			unit: true,
			brand: true,
			category: true,
			subUnit: {
				with: {
					unit: true
				}
			},
			inventory: {
				with: {
					constUnit: true
				},
				orderBy: desc(inventory.datetime_buy)
			}
		}
	});
	return {
		get_product
	};
}) satisfies PageServerLoad;
