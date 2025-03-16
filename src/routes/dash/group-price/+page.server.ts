import { db } from '$lib/server/db';
import { sampleInvoice } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_sample_invoice = await db.query.sampleInvoice.findMany({
		with: {
			productOrders:{
				with:{

					product:true
				}
				
			}
		}
	});
	return { get_sample_invoice };
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	delete: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		await db.delete(sampleInvoice).where(eq(sampleInvoice.id, Number(id)));
	}
};
