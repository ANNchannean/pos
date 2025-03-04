import { db } from '$lib/server/db';
import { customer, product } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

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
    delete: async ({ request }) => {
        const body = await request.formData();
        const { customer_id } = Object.fromEntries(body) as Record<string, string>;
        await db.delete(customer).where(eq(customer.id, Number(customer_id)));
    }
};