import { db } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';
import {  product, productOrder, sampleInvoice } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';


// រុញទិន្នន័យទៅ Client  តាមរយៈ Load Function
export const load = (async ({ url }) => {
	const q = url.searchParams.get('product_q') || '';
	const product_id = url.searchParams.get('product_id') || '';
	const sample_invoice_id = url.searchParams.get('sample_invoice_id') || '';
	const get_sample_invoice = await db.query.sampleInvoice.findFirst({
		where: eq(sampleInvoice.id, +sample_invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							brand: true,
							category: true,

						}
					},
					unit: true
				}
			}
		}
	});
	const get_products = await db.query.product.findMany({
		where: like(product.name, `%${q}%`),
		limit: 200
	});
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id)),
		with: {
			subUnit: {
				with: {
					unit: true
				}
			},
			unit: true
		}
	});

	return {
		get_product,
		get_products,
		get_sample_invoice,
	};
}) satisfies PageServerLoad;

// ទទូលសំណើរមកពីClient តាមរយៈ Actions Form
export const actions: Actions = {
	create_sample_invoice: async ({ request }) => {
		const body = await request.formData();
		const { sample_invoice_id, product_id, qty, unit_id } =
			Object.fromEntries(body) as Record<string, string>;
		if (!sample_invoice_id) {
			const create_sample_invoice: { id: number }[] = await db.insert(sampleInvoice).values({
				amount: 0,
				name: '',
			}).$returningId()
			await db.insert(productOrder).values({
				sample_invoice_id: create_sample_invoice[0].id,
				product_id: +product_id,
				unit_id: +unit_id,
				quantity: +qty,
				amount: 0,
				price: 0,
				total: 0,
			})
			redirect(300, `/dash/group-price/create?sample_invoice_id=${create_sample_invoice[0].id}`);
		}
		if (sample_invoice_id) {
			console.log(body)
			await db.insert(productOrder).values({
				sample_invoice_id: +sample_invoice_id,
				product_id: +product_id,
				unit_id: +unit_id,
				quantity: +qty,
				amount: 0,
				price: 0,
				total: 0,
			})
			redirect(300, `/dash/group-price/create?sample_invoice_id=${sample_invoice_id}`);
		}

	},
	update_sample_invoice: async ({ request }) => {
		const body = await request.formData();
		const { sample_invoice_id, amount,
			name,
			note } =
			Object.fromEntries(body) as Record<string, string>;

		if (sample_invoice_id) {
			await db.update(sampleInvoice).set({
				amount: +amount,
				name: name,
				note: note

			}).where(eq(sampleInvoice.id, +sample_invoice_id))

			redirect(300, `/dash/group-price/create?sample_invoice_id=${sample_invoice_id}`);
		}


	},
	delete: async ({ request }) => {
		const body = await request.formData();
		const product_order_id = body.get('product_order_id');
		if (!product_order_id) return fail(400, { validDelete: true });
		await db.delete(productOrder).where(eq(productOrder.id, +product_order_id));


	}
};

