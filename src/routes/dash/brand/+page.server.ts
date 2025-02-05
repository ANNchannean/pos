import { db } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { brand } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_brands = await db.query.brand.findMany();
	return {
		get_brands
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { brand_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(brand).where(eq(brand.id, Number(brand_id)));
	}
};
