import { db } from '$lib/server/db';
import { invoice, product, productOrder } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { localFormat } from '$lib/client/helper';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
    const invoice_id = url.searchParams.get('invoice_id') || ''
    const brand_id = url.searchParams.get('brand_id') || ''
    const category_id = url.searchParams.get('category_id') || ''
    const get_customers = await db.query.customer.findMany()
    const get_brands = await db.query.brand.findMany()
    const get_categories = await db.query.category.findMany()
    const get_products = await db.query.product.findMany({
        with:{
            subUnit: {
                with:{
                    unit:true
                }
            },
            unit:true
        },
        where: and(
            brand_id ? eq(product.brand_id, +brand_id) : undefined,
            category_id ? eq(product.category_id, +category_id) : undefined
        ),
        limit: 50
    })
    const get_invoice = await db.query.invoice.findFirst({
        where: eq(invoice.id, +invoice_id),
        with: {
            productOrders: {
                with: {
                    product: true
                }
            }
        }
    })
    return { get_customers, get_products, get_brands, get_categories, get_invoice };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // សម្រាប់កង្កើតប្រេនថ្មី
    pos: async ({ request, locals }) => {
        const seller_id = locals?.user?.id
        const body = await request.formData();
        const { total_amount, billing_note, final_discount, get_amount, final_total, invoice_id } = Object.fromEntries(body) as Record<string, string>;
        const product_id = body.getAll('product_id')
        const discount = body.getAll('discount')
        const qty = body.getAll('qty')
        const price = body.getAll('price')
        const total = body.getAll('total')
        const unit_id = body.getAll('unit_id')
        const amount = body.getAll('amount')
        if (!final_total || !seller_id) return fail(400, { validErr: true })
        // បញ្ជូលទំនិញទៅ ការកុម្មង់
        if (!invoice_id) {
            const create_invocie = await db.insert(invoice).values({
                amount: +total_amount,
                created_at: localFormat.datetime(new Date()),
                total: +final_total,
                amount_paid: +get_amount,
                discount: final_discount,
                note: billing_note,
                seller_id: seller_id,
                status: +final_total > +get_amount ? 'debt' : 'paid',
            }).$returningId()

            // បញ្ជូលទំនិញទៅProductOrder
            for (let i = 0; i < product_id.length; i++) {
                const discount_ = discount[i].toString()
                const qty_ = qty[i].toString()
                const price_ = price[i].toString()
                const total_ = total[i].toString()
                const unit_id_ = unit_id[i].toString()
                const amount_ = amount[i].toString()
                const product_id_ = product_id[i].toString()
                await db.insert(productOrder).values({
                    product_id: +product_id_,
                    unit_id: +unit_id_,
                    quantity: +qty_,
                    price: +price_,
                    total: +total_,
                    amount: +amount_,
                    discount: discount_,
                    invoice_id: create_invocie[0].id,

                })
            }
            redirect(300, `/dash/report/print?invoice_id=${create_invocie[0].id}`)
        }
        if (invoice_id) {
            const get_invoice = await db.query.invoice.findFirst({
                where: eq(invoice.id, +invoice_id),
                with: {
                    productOrders: true
                }
            })
            await db.update(invoice).set({
                amount: +total_amount,
                created_at: localFormat.datetime(new Date()),
                total: +final_total,
                amount_paid: +get_amount,
                discount: final_discount,
                note: billing_note,
                seller_id: seller_id,
                status: +final_total > +get_amount ? 'debt' : 'paid',
            }).where(eq(invoice.id, +invoice_id))
            // បញ្ជូលទំនិញទៅProductOrder
            for (let i = 0; i < product_id.length; i++) {
                const discount_ = discount[i].toString()
                const qty_ = qty[i].toString()
                const price_ = price[i].toString()
                const total_ = total[i].toString()
                const unit_id_ = unit_id[i].toString()
                const amount_ = amount[i].toString()
                const product_id_ = product_id[i].toString()
                if (get_invoice?.productOrders.some((e) => e.product_id === +product_id_)) {
                    console.log('update')
                    await db.update(productOrder).set({
                        product_id: +product_id_,
                        unit_id: +unit_id_,
                        quantity: +qty_,
                        price: +price_,
                        total: +total_,
                        amount: +amount_,
                        discount: discount_,
                    })
                } else {
                    console.log('insert')
                    await db.insert(productOrder).values({
                        product_id: +product_id_,
                        unit_id: +unit_id_,
                        quantity: +qty_,
                        price: +price_,
                        total: +total_,
                        amount: +amount_,
                        discount: discount_,
                        invoice_id: +invoice_id,
                    })
                }
            }
            redirect(300, `/dash/report/print?invoice_id=${invoice_id}`)
        }
    }
};