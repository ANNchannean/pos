import { db } from '$lib/server/db';
import { exspend } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    const get_exspends = await db.query.exspend.findMany({
        with:{
            user:true
        }
    })
    return { get_exspends };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // សម្រាប់កង្កើតប្រេនថ្មី
    delete: async ({ request }) => {
        const body = await request.formData();
        const { exspend_id } = Object.fromEntries(body) as Record<string, string>;
        await db.delete(exspend).where(eq(exspend.id, Number(exspend_id)));
    }
};