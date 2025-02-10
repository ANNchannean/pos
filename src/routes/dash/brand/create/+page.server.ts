import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { brand } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const brand_id = url.searchParams.get('brand_id');

	const get_brand = await db.query.brand.findFirst({
		where: eq(brand.id, Number(brand_id))
	});

	return {
		get_brand
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	create_brand: async ({ request }) => {
		const body = await request.formData();
		const { brand_name, brand_id } = Object.fromEntries(body) as Record<string, string>;
		const valid_brand = await db.query.brand.findFirst({
			where: eq(brand.name, brand_name)
		})
		if (valid_brand) return fail(400, { message: 'ប្រេននេះមានរួចហើយ' });
		if (brand_name === "") return fail(400, { message: 'សូមបំពេញឈ្មោះប្រេន' });
		if (brand_id) {
			await db
				.update(brand)
				.set({
					name: brand_name
				})
				.where(eq(brand.id, Number(brand_id)))
				.catch((err) => {
					console.log(err)
				})
		}
		if (!brand_id) {
			await db.insert(brand).values({
				name: brand_name
			})
				.catch((err) => {
					console.log(err)
				})
		}

		redirect(300, '/dash/brand');
	}
};
