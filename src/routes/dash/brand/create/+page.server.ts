import { db } from '$lib/server/db';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { brand } from '$lib/server/db/schema';

export const load = (async () => {
    const get_brands = await db.query.brand.findMany()
}) satisfies PageServerLoad;

export const actions: Actions = {
    create_brand: async ({ request }) => {
        const body = await request.formData()

        const { brand: brand_name } = Object.fromEntries(body) as Record<string, string>

        await db.insert(brand).values({
            name: brand_name
        })
        redirect(300, "/dash/brand")
    }
};