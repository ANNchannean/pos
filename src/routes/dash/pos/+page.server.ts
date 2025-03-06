import { db } from '$lib/server/db';
import {  invoice, product, productOrder } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { localFormat } from '$lib/client/helper';

export const load = (async ({ url }) => {
    const brand_id = url.searchParams.get('brand_id') || ''
    const category_id = url.searchParams.get('category_id') || ''
    const get_customers = await db.query.customer.findMany()
    const get_brands = await db.query.brand.findMany()
    const get_categories = await db.query.category.findMany()
    const get_products = await db.query.product.findMany({
        where: and(
            brand_id ? eq(product.brand_id, +brand_id) : undefined,
            category_id ? eq(product.category_id, +category_id) : undefined
        ),
        limit: 50
    })
    return { get_customers, get_products, get_brands, get_categories };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // សម្រាប់កង្កើតប្រេនថ្មី
    pos: async ({ request }) => {
        const body = await request.formData();
        const { return_or_balance, total_amount, billing_note } = Object.fromEntries(body) as Record<string, string>;
        const product_id = body.getAll('product_id')
        const discount = body.getAll('discount')
        const qty = body.getAll('qty')
        const price = body.getAll('price')
        const total = body.getAll('total')
        const unit_id = body.getAll('unit_id')
        const amount = body.getAll('amount')
        // បញ្ជូលទំនិញទៅ ការកុម្មង់
        const create_invocie = await db.insert(invoice).values({
            amount: +total_amount,
            created_at: localFormat.datetime(new Date()),
            total: +total_amount,
            amount_paid: +total_amount,
            status: +return_or_balance < 0 ? 'paid' : 'partial',
            note: billing_note,
            return: +return_or_balance > 0 ? null : +return_or_balance.replace('-', '')
        }).$returningId()
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
    }
};