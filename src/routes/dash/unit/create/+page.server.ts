import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { unit } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const unit_id = url.searchParams.get('unit_id');

	const get_unit = await db.query.unit.findFirst({
		where: eq(unit.id, Number(unit_id))
	});

	return {
		get_unit
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតខ្នាតថ្មី
	create_unit: async ({ request }) => {
		const body = await request.formData();
		const { unit_name, unit_id } = Object.fromEntries(body) as Record<string, string>;
		const valid_unit = await db.query.unit.findFirst({
			where: eq(unit.name, unit_name)
		})
		if (valid_unit) return fail(400, { message: 'ខ្នាតនេះមានរួចហើយ' });
		if (unit_name === "") return fail(400, { message: 'សូមបំពេញឈ្មោះខ្នាត' });
		if (unit_id) {
			await db
				.update(unit)
				.set({
					name: unit_name
				})
				.where(eq(unit.id, Number(unit_id)))
				.catch((err) => {
					console.log(err)
				})
		}
		if (!unit_id) {
			await db.insert(unit).values({
				name: unit_name
			})
				.catch((err) => {
					console.log(err)
				})
		}

		redirect(300, '/dash/unit');
	}
};
