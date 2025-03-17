import { db } from '$lib/server/db';
import { customer, invoice, product, user } from '$lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { betweenHelper } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url, locals }) => {
    if (locals.user?.role !== 'admin') redirect(303, '/dash/pos')
    const count_product = await db.$count(product)
    const count_user = await db.$count(user)
    const count_customer = await db.$count(customer)
    const get_exspends = await db.query.exspend.findMany()
    const get_invoices = await db.query.invoice.findMany({
        where: and(
            betweenHelper(url, invoice.created_at),
            eq(invoice.status, 'paid')
        ),
        with: {
            customer: true,
            productOrders: {
                with: {
                    product: true,
                    unit: true

                }
            }
        },
        orderBy: [desc(invoice.created_at)]
    });
    return {
        count_product,
        count_user,
        count_customer,
        exspend: get_exspends.reduce((s, e) => s + Number(e.amount), 0),
        income: get_invoices.reduce((s, e) => s + Number(e.total), 0),
        get_invoices
    };
}) satisfies PageServerLoad;