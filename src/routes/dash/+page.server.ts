import { db } from '$lib/server/db';
import { customer, exspend, invoice, product, user } from '$lib/server/db/schema';
import { desc, eq, and, gte } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { betweenHelper } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { localFormat } from '$lib/client/helper';
import { sendMessageToTelegram } from '$lib/server/telegram';

export const load = (async ({ url, locals }) => {
    if (locals.user?.role !== 'admin') redirect(303, '/dash/pos')
    const start = url.searchParams.get('start')
    const end = url.searchParams.get('end')
    const count_product = await db.$count(product)
    const count_user = await db.$count(user)
    const count_customer = await db.$count(customer)
    const get_exspends = await db.query.exspend.findMany({
        where: and(
            start && end ? betweenHelper(url, exspend.created_at) : gte(exspend.created_at, localFormat.date(new Date()))
        ),
        with: {
            inventory: {
                with: {
                    product: true,
                    constUnit: true

                }
            },
            user: true
        },
        orderBy: [desc(exspend.created_at)]
    })
    const get_invoices = await db.query.invoice.findMany({
        where: and(
            start && end ? betweenHelper(url, invoice.created_at) : gte(invoice.created_at, localFormat.date(new Date())),
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
        get_invoices,
        get_exspends
    };
}) satisfies PageServerLoad;
export const actions: Actions = {
    // សម្រាប់កង្កើតប្រេនថ្មី
    telegram: async ({ request }) => {
        const body = await request.formData();
        const { income, exspend, start, end } = Object.fromEntries(body) as Record<string, string>;
        let date = `របាយការណ៌ថ្ងៃ ${localFormat.date(start)} រហូតដល់ ${localFormat.date(end)}`;
        if (!start && !end) date = `របាយការណ៌ថ្ងៃ ${localFormat.date(new Date())}`
        const message = `${date} \n ចំណូល  = $ ${income} \n ចំណាយ = $ ${exspend} \n ចំណេញ = $ ${+income - +exspend}`
        await sendMessageToTelegram(message)
    }
};
