import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const get_customers = await db.query.customer.findMany()
    return { get_customers };
}) satisfies PageServerLoad;