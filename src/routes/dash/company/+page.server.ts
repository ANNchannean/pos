import { localFormat } from '$lib/client/helper';
import { db } from '$lib/server/db';
import { companyInfo } from '$lib/server/db/schema';
import { updateFile, uploadFile } from '$lib/server/fileHandle';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const get_company = await db.query.companyInfo.findFirst();
	return { get_company };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async ({ request }) => {
		const body = await request.formData();
		const { name_khmer, name_english, description, contact, address, id, logo, note, chat_id,
			bot_token } =
			Object.fromEntries(body) as Record<string, string>;
		const file = body.get('file') as File;
		if (id) {
			await db
				.update(companyInfo)
				.set({
					name_khmer,
					name_english,
					description,
					contact,
					address,
					chat_id,
					bot_token,
					note,
					logo: file ? await updateFile(file, logo) : undefined,
					created_at: localFormat.datetime(new Date())
				})
				.where(eq(companyInfo.id, Number(id)));
		} else {
			await db.insert(companyInfo).values({
				name_khmer,
				name_english,
				description,
				contact,
				note,
				chat_id,
				bot_token,
				address,
				logo: file ? await uploadFile(file) : null,
				created_at: localFormat.datetime(new Date())
			});
		}
	}
};
