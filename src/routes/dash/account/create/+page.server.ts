import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { user } from '$lib/server/db/schema';

export const load = (async ({ url }) => {
	const user_id = url.searchParams.get('user_id') ?? '';
	const get_user = await db.query.user.findFirst({
		where: eq(user.id, user_id)
	});

	return {
		get_user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រភេទទំនិញថ្មី
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const address = formData.get('address')?.toString();
		const contact = formData.get('contact')?.toString();
		const user_id = formData.get('user_id')?.toString();
		const role = formData.get('role') as "admin" | "cashier"
		const validUser = {
			username: false,
			contact: false,
			adddress: false,
			password: false,
			role: false
		};
		if (!username) validUser.username = true;
		if (!contact) validUser.contact = true;
		if (!password) validUser.password = true;
		if (!role) validUser.role = true;
		if (Object.values(validUser).includes(true)) return fail(400, validUser);
		if (!validateUsername(username)) {
			return fail(400, { message: 'ឈ្មោះមិនត្រឹមត្រូវ' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ' });
		}
		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!user_id) {
			try {
				await db.insert(table.user).values({ id: userId, username, passwordHash, address, contact, role });
			} catch (e) {
				console.log(e);
				return fail(500, { message: 'An error has occurred' });
			}
		}
		if (user_id) {
			try {
				await db.update(table.user).set({ username, passwordHash, address, contact, role }).where(eq(table.user.id, user_id));
			} catch (e) {
				console.log(e);
				return fail(500, { message: 'An error has occurred' });
			}
		}


	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
