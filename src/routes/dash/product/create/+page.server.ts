import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


// រុញទិន្នន័យទៅ Client  តាមរយៈ Load Function 
export const load = (async ({ url }) => {

	const product_id = url.searchParams.get('product_id');
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id))
	});
	const get_categories = await db.query.category.findMany();
	const get_brands = await db.query.brand.findMany();
	const get_units = await db.query.unit.findMany();
	return {
		get_product,
		get_categories,
		get_brands,
		get_units

	};
}) satisfies PageServerLoad;



// ទទូលសំណើរមកពីClient តាមរយៈ Actions Form
export const actions: Actions = {
	create_product: async ({ request }) => {
		const body = await request.formData();

		const { product_name, product_id, barcode,
			price,
			stock,
			category_id,
			brand_id, unit_id } = Object.fromEntries(body) as Record<string, string>;
		if (product_id) {
			await db
				.update(product)
				.set({
					name: product_name,
					barcode: barcode,
					price: price,
					stock: +stock,
					category_id: +category_id,
					brand_id: +brand_id,
					unit_id: +unit_id

				})
				.where(eq(product.id, Number(product_id)));
		}
		if (!product_id) {
			await db.insert(product).values({
				name: product_name,
				barcode: barcode,
				price: price,
				stock: +stock,
				category_id: +category_id,
				brand_id: +brand_id,
				unit_id: +unit_id

			});
		}

		redirect(300, '/dash/product');
	}
};
