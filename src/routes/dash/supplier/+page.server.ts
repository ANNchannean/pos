import { db } from '$lib/server/db';
import { supplier } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_suppliers = await db.query.supplier.findMany();
	return { get_suppliers };
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { supplier_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(supplier).where(eq(supplier.id, Number(supplier_id)));
	}
};
