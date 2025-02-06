import { db } from '$lib/server/db';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { unit } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	const get_units = await db.query.unit.findMany();
	return {
		get_units
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { unit_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(unit).where(eq(unit.id, Number(unit_id)));
	}
};
