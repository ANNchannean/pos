import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
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
	// សម្រាប់កង្កើតប្រេនថ្មី
	create_unit: async ({ request }) => {
		const body = await request.formData();

		const { unit_name, unit_id } = Object.fromEntries(body) as Record<string, string>;
		if (unit_id) {
			await db
				.update(unit)
				.set({
					name: unit_name
				})
				.where(eq(unit.id, Number(unit_id)));
		}
		if (!unit_id) {
			await db.insert(unit).values({
				name: unit_name
			});
		}

		redirect(300, '/dash/unit');
	}
};
