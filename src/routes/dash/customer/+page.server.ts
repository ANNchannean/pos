import { db } from '$lib/server/db';
import { customer } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    const get_customers = await db.query.customer.findMany()
    return { get_customers };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // សម្រាប់កង្កើតប្រេនថ្មី
    delete: async ({ request }) => {
        const body = await request.formData();
        const { customer_id } = Object.fromEntries(body) as Record<string, string>;
        await db.delete(customer).where(eq(customer.id, Number(customer_id)));
    }
};