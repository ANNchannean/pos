import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
export const load: PageServerLoad = async (event) => {
    if (!event.locals.session) {
        return fail(401);
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);
    return redirect(302, '/auth/login');
};
