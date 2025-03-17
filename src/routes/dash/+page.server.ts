import { db } from '$lib/server/db';
import { customer, invoice, product, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const count_product = await db.$count(product)
    const count_user = await db.$count(user)
    const count_customer = await db.$count(customer)
    const get_exspends = await db.query.exspend.findMany()
    const get_invoices = await db.query.invoice.findMany({
        where:
            eq(invoice.status, 'paid'),


    })
    return {
        count_product,
        count_user,
        count_customer,
        exspend: get_exspends.reduce((s,e) => s + Number(e.amount),0 ),
        income: get_invoices.reduce((s,e) => s + Number(e.total),0 )
    };
}) satisfies PageServerLoad;