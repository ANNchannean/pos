import { db } from '$lib/server/db';
import { customer, invoice, product, productOrder, sampleInvoice } from '$lib/server/db/schema';
import { and, eq, like, or } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { localFormat } from '$lib/client/helper';
import { fail, redirect } from '@sveltejs/kit';
import { calulatorStock, calulatorUpdateStock } from '$lib/server/utils';

export const load = (async ({ url }) => {
	const search = url.searchParams.get('search') || 'coffee';
	const customer_q = url.searchParams.get('customer_q') || '';
	const product_q = url.searchParams.get('product_q') || '';
	const invoice_id = url.searchParams.get('invoice_id') || '';
	const sample_invoice_id = url.searchParams.get('sample_invoice_id') || '';
	const brand_id = url.searchParams.get('brand_id') || '';
	const category_id = url.searchParams.get('category_id') || '';
	const get_customers = await db.query.customer.findMany(({
		where: like(customer.name, `%${customer_q}%`)
	}));
	const get_brands = await db.query.brand.findMany();
	const get_categories = await db.query.category.findMany();
	const get_product_scan = await db.query.product.findMany({
		with: {
			subUnit: {
				with: {
					unit: true
				}
			},
			unit: true
		},
		where: like(product.name, `%${product_q}%`),
		limit: 50
	});
	const get_products = await db.query.product.findMany({
		with: {
			subUnit: {
				with: {
					unit: true
				}
			},
			unit: true,
			category:{
				with:{
					properyItem:true
				}
			}
		},
		where: and(
			brand_id ? eq(product.brand_id, +brand_id) : undefined,
			category_id ? eq(product.category_id, +category_id) : undefined,
			or(

				like(product.name, `%${search}%`),
				like(product.model, `%${search}%`),
				like(product.condition, `%${search}%`)
			)

		),
		limit: 50
	});
	const get_sample_invoice = await db.query.sampleInvoice.findFirst({
		where: eq(sampleInvoice.id, +sample_invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							subUnit: {
								with: {
									unit: true
								}
							},
							unit: true
						}
					}
				}
			},

		}
	});
	const get_invoice = await db.query.invoice.findFirst({
		where: eq(invoice.id, +invoice_id),
		with: {
			productOrders: {
				with: {
					product: {
						with: {
							subUnit: {
								with: {
									unit: true
								}
							},
							unit: true
						}
					}
				}
			},
			customer: true
		}
	});
	return { get_customers, get_products, get_brands, get_categories, get_invoice, get_product_scan, get_sample_invoice };
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រេនថ្មី
	pos: async ({ request, locals }) => {
		const seller_id = locals?.user?.id;
		const body = await request.formData();
		const {
			total_amount,
			billing_note,
			final_discount,
			get_amount,
			final_total,
			invoice_id,
			customer_id,
			save
		} = Object.fromEntries(body) as Record<string, string>;
		const product_id = body.getAll('product_id');
		const discount = body.getAll('discount');
		const qty = body.getAll('qty');
		const price = body.getAll('price');
		const total = body.getAll('total');
		const type = body.getAll('type');
		const unit_id = body.getAll('unit_id');
		const amount = body.getAll('amount');
		if (!final_total || !seller_id) return fail(400, { validErr: true });
		// បញ្ជូលទំនិញទៅ ការកុម្មង់

		if (!invoice_id) {
			const create_invocie = await db
				.insert(invoice)
				.values({
					amount: +total_amount,
					created_at: localFormat.datetime(new Date()),
					total: +final_total,
					amount_paid: +get_amount,
					discount: final_discount,
					note: billing_note,
					seller_id: seller_id,
					customer_id: customer_id ? +customer_id : null,
					status: save === 'pending' ? 'pending' : +final_total > +get_amount ? 'debt' : 'paid'
				})
				.$returningId();

			// បញ្ជូលទំនិញទៅProductOrder
			for (let i = 0; i < product_id.length; i++) {
				const discount_ = discount[i]?.toString();
				const qty_ = qty[i]?.toString();
				const price_ = price[i]?.toString();
				const total_ = total[i]?.toString();
				const unit_id_ = unit_id[i]?.toString();
				const type_ = type[i]?.toString();
				const amount_ = amount[i]?.toString();
				const product_id_ = product_id[i]?.toString();
				await db.insert(productOrder).values({
					product_id: +product_id_,
					unit_id: +unit_id_,
					quantity: +qty_,
					price: +price_,
					total: +total_,
					type: type_ === 'set' ? 'set' : null,
					amount: +amount_,
					discount: discount_,
					invoice_id: create_invocie[0].id
				});
			}
			await calulatorStock(create_invocie[0].id)
			redirect(300, `/dash/report/print?invoice_id=${create_invocie[0].id}`);
		}
		if (invoice_id) {
			await calulatorUpdateStock(+invoice_id)
			const get_invoice = await db.query.invoice.findFirst({
				where: eq(invoice.id, +invoice_id),
				with: {
					productOrders: true
				}
			});
			await db
				.update(invoice)
				.set({
					amount: +total_amount,
					created_at: localFormat.datetime(new Date()),
					total: +final_total,
					amount_paid: +get_amount,
					discount: final_discount,
					note: billing_note,
					seller_id: seller_id,
					customer_id: customer_id ? +customer_id : null,
					status: save === 'pending' ? 'pending' : +final_total > +get_amount ? 'debt' : 'paid'
				})
				.where(eq(invoice.id, +invoice_id));
			// បញ្ជូលទំនិញទៅProductOrder
			for (let i = 0; i < product_id.length; i++) {
				const discount_ = discount[i]?.toString();
				const qty_ = qty[i]?.toString();
				const price_ = price[i]?.toString();
				const total_ = total[i]?.toString();
				const unit_id_ = unit_id[i]?.toString();
				const type_ = type[i]?.toString();
				const amount_ = amount[i]?.toString();
				const product_id_ = product_id[i]?.toString();
				const productOrder_ = get_invoice?.productOrders.find((e) => e.product_id === +product_id_);
				if (productOrder_?.id) {
					await db
						.update(productOrder)
						.set({
							product_id: +product_id_,
							unit_id: +unit_id_,
							quantity: +qty_,
							price: +price_,
							type: type_ === 'set' ? 'set' : null,
							total: +total_,
							amount: +amount_,
							discount: discount_
						})
						.where(eq(productOrder.id, +productOrder_?.id));
				} else {
					await db.insert(productOrder).values({
						product_id: +product_id_,
						unit_id: +unit_id_,
						quantity: +qty_,
						price: +price_,
						total: +total_,
						type: type_ === 'set' ? 'set' : null,
						amount: +amount_,
						discount: discount_,
						invoice_id: +invoice_id
					});
				}
			}
			for (const e of get_invoice?.productOrders || []) {
				const is_created = product_id.some((ee) => +ee === e.product_id)
				if (!is_created) {
					await db.delete(productOrder).where(eq(productOrder.id, e.id));
				}
			}
			await calulatorStock(+invoice_id)
			redirect(300, `/dash/report/print?invoice_id=${invoice_id}`);
		}
	}
};
