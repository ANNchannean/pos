import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { exspend } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const exspend_id = url.searchParams.get('exspend_id');
	const get_exspend = await db.query.exspend.findFirst({
		where: eq(exspend.id, Number(exspend_id))
	});

	return {
		get_exspend
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រភេទទំនិញថ្មី
	create_exspend: async ({ request, locals }) => {
		const user_id = String(locals.user?.id)
		const body = await request.formData();
		const { amount, reason, datetime, exspend_id } = Object.fromEntries(body) as Record<string, string>

		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន
		const validexspend = {
			amount: false,
			datetime: false,

		}
		if (!amount) validexspend.amount = true
		if (!datetime) validexspend.datetime = true

		if (Object.values(validexspend).includes(true)) return fail(400, validexspend);
		// បញ្ជប់ការពិនិ្យ
		if (exspend_id) {
			await db
				.update(exspend)
				.set({
					amount: Number(amount),
					reason: reason,
					created_at: datetime,

				})
				.where(eq(exspend.id, Number(exspend_id)))
				.catch((err) => {
					console.log(err)
				})
		}
		if (!exspend_id) {
			await db
				.insert(exspend)
				.values({
					amount: Number(amount),
					reason: reason,
					created_at: datetime,
					user_id: user_id,

				})
				.catch((err) => {
					console.log(err)
				})
		}

		redirect(300, '/dash/exspend');
	}
};
