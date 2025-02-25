import { db } from '$lib/server/db';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { product, subUnit } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// រុញទិន្នន័យទៅ Client  តាមរយៈ Load Function 
export const load = (async ({ url }) => {

	const product_id = url.searchParams.get('product_id');
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id)),
		with: {
			unit: true,
			subUnit: {
				with: {
					unit: true
				}
			}
		}
	});

	const get_units = await db.query.unit.findMany();
	return {
		get_product,
		get_units

	};
}) satisfies PageServerLoad;



// ទទូលសំណើរមកពីClient តាមរយៈ Actions Form
export const actions: Actions = {
	add_sub_unit: async ({ request }) => {
		const body = await request.formData();
		const { product_id, unit_id, qty_per_unit } = Object.fromEntries(body) as Record<string, string>;
		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន

		if (!unit_id || !qty_per_unit) return fail(400, { valid_unit_id: true })
		// បញ្ជប់ការពិនិ្យ
		//ករណី produts មានស្រាប់ ត្រូវ Update
		await db.insert(subUnit).values({
			unit_id: +unit_id,
			product_id: +product_id,
			qty_per_unit: +qty_per_unit
		})
	},
	delete_sub_unit: async ({ request }) => {
		const body = await request.formData();
		const { sub_unit_id } = Object.fromEntries(body) as Record<string, string>;
		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន

		if (!sub_unit_id) return fail(400, { valid_unit_id: true })
		// បញ្ជប់ការពិនិ្យ
		//ករណី produts មានស្រាប់ ត្រូវ Update
		await db.delete(subUnit).where(eq(subUnit.id, +sub_unit_id))
	}
};
