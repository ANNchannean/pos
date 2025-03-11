import { db } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { inventory, product } from '$lib/server/db/schema';
import { and, eq, like, or } from 'drizzle-orm';
import { pagination } from '$lib/server/utils';

export const load = (async ({ url }) => {
	const category_id = url.searchParams.get('category_id') ?? '';
	const brand_id = url.searchParams.get('brand_id') ?? '';
	const q = url.searchParams.get('q') || '';
	const get_products = await db.query.product.findMany({
		where: and(
			category_id ? eq(product.category_id, +category_id) : undefined,
			brand_id ? eq(product.brand_id, +brand_id) : undefined,
			or(like(product.name, `%${q}%`), like(product.description, `%${q}%`))
		),

		with: {
			brand: true,
			category: true,
			unit: true,
			subUnit: {
				with: {
					unit: true
				}
			},
			inventory: {
				with: {
					constUnit: true
				},
				where: and(eq(inventory.is_outstock, false), eq(inventory.is_close_inventory, false))
			}
		},
		...pagination(url)
	});
	const get_brands = await db.query.brand.findMany({});
	const get_categories = await db.query.category.findMany({});
	return {
		get_products,
		get_brands,
		get_categories
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
