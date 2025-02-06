import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { category } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const category_id = url.searchParams.get('category_id');

	const get_category = await db.query.category.findFirst({
		where: eq(category.id, Number(category_id))
	});

	return {
		get_category
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	create_category: async ({ request }) => {
		const body = await request.formData();

		const { category_name, category_id } = Object.fromEntries(body) as Record<string, string>;
		if (category_id) {
			await db
				.update(category)
				.set({
					name: category_name
				})
				.where(eq(category.id, Number(category_id)));
		}
		if (!category_id) {
			await db.insert(category).values({
				name: category_name
			});
		}

		redirect(300, '/dash/category');
	}
};
