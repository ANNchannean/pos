import { invoice } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load = (async ({ url }) => {
    const invoice_id = url.searchParams.get('invoice_id') ?? ''
    const get_company = await db.query.companyInfo.findFirst()
    const get_invoice = await db.query.invoice.findFirst({
        where: eq(invoice.id, +invoice_id),
        with: {
            productOrders: {
                with: {
                    product: true,
                    unit:true
                }
            },
            customer:true,
            seller:true
        }
    })
    return { get_invoice,get_company };
}) satisfies PageServerLoad;