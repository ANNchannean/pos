import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    if (!locals.session || !locals.user) redirect(302, '/auth/login');
    return {
        user:locals?.user
    };
}) satisfies LayoutServerLoad;