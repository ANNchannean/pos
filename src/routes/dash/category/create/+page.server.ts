import { db } from '$lib/server/db';
import {  fail, redirect, type Actions } from '@sveltejs/kit';
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
	// សម្រាប់កង្កើតប្រភេទទំនិញថ្មី
	create_category: async ({ request }) => {
		const body = await request.formData();
		const { category_name, category_id } = Object.fromEntries(body) as Record<string, string>;
		const valid_category = await db.query.category.findFirst({
			where: eq(category.name, category_name)
		})
		if (valid_category?.name === category_name) return fail(400, { message: 'ប្រភេទទំនិញនេះមានរួចហើយ' });
		if (category_name === "") return fail(400, { message: 'សូមបំពេញឈ្មោះប្រភេទទំនិញ' });
		if (category_id) {
			await db
				.update(category)
				.set({
					name: category_name
				})
				.where(eq(category.id, Number(category_id)))
				.catch((err) => {
					console.log(err)
				})
		}
		if (!category_id) {
			await db.insert(category).values({
				name: category_name
			})
				.catch((err) => {
					console.log(err)
				})
		}

		redirect(300, '/dash/category');
	}
};
