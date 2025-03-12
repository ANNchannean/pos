import { db } from '$lib/server/db';
import { and, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { invoice } from '$lib/server/db/schema';
import { pagination, betweenHelper } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
export const load = (async ({ url }) => {
	const status = url.searchParams.get('status') as 'paid' | 'debt';
	const seller_id = url.searchParams.get('seller_id') ?? '';
	const customer_id = url.searchParams.get('customer_id') ?? '';
	const get_invoices = await db.query.invoice.findMany({
		where: and(
			betweenHelper(url, invoice.created_at),
			customer_id ? eq(invoice.customer_id, +customer_id) : undefined,
			seller_id ? eq(invoice.seller_id, seller_id) : undefined,
			status ? eq(invoice.status, status) : undefined,
			eq(invoice.status, 'debt')
		),
		with: {
			customer: true,
			seller: true
		},
		...pagination(url),
		orderBy: [desc(invoice.created_at)]
	});
	const count = await db.$count(
		invoice,
		and(
			betweenHelper(url, invoice.created_at),
			customer_id ? eq(invoice.customer_id, +customer_id) : undefined,
			seller_id ? eq(invoice.seller_id, seller_id) : undefined,
			status ? eq(invoice.status, status) : undefined,
			eq(invoice.status, 'debt')
		)
	);
	return { get_invoices, items: count };
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete: async ({ request }) => {
		const body = await request.formData();
		const { id } = Object.fromEntries(body) as Record<string, string>;
		if (!id) return fail(400, { validDelete: true });
		await db.delete(invoice).where(eq(invoice.id, Number(id)));
	}
};
