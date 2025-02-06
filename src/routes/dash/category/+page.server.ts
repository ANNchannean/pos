import { db } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { category } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_categoryies = await db.query.category.findMany();
	return {
		get_categoryies
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { category_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(category).where(eq(category.id, Number(category_id)));
	}
};
