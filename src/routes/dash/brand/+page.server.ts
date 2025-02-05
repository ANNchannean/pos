import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const get_brands = await db.query.brand.findMany()
    return {
        get_brands
    }
}) satisfies PageServerLoad;
