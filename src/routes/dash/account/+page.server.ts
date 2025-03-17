import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_users = await db.query.user.findMany();
	return { get_users };
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { user_id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(user).where(eq(user.id, user_id));
	}
};
