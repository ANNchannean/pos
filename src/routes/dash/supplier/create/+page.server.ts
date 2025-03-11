import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supplier } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const supplier_id = url.searchParams.get('supplier_id');
	const get_supplier = await db.query.supplier.findFirst({
		where: eq(supplier.id, Number(supplier_id))
	});

	return {
		get_supplier
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រភេទទំនិញថ្មី
	create_supplier: async ({ request }) => {
		const body = await request.formData();
		const {
			supplier_company_name,
			supplier_name,
			supplier_address,
			supplier_contact,
			supplier_id
		} = Object.fromEntries(body) as Record<string, string>;

		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន
		const validSupplier = {
			name: false,
			contact: false,
			adddress: false,
			company_name: false
		};
		if (!supplier_name) validSupplier.name = true;
		if (!supplier_contact) validSupplier.contact = true;
		if (!supplier_address) validSupplier.adddress = true;
		if (!supplier_company_name) validSupplier.company_name = true;
		if (Object.values(validSupplier).includes(true)) return fail(400, validSupplier);
		// បញ្ជប់ការពិនិ្យ
		if (supplier_id) {
			await db
				.update(supplier)
				.set({
					name: supplier_name,
					address: supplier_address,
					contact: supplier_contact,
					company_name: supplier_company_name
				})
				.where(eq(supplier.id, Number(supplier_id)))
				.catch((err) => {
					console.log(err);
				});
		}
		if (!supplier_id) {
			await db
				.insert(supplier)
				.values({
					name: supplier_name,
					address: supplier_address,
					contact: supplier_contact,
					company_name: supplier_company_name
				})
				.catch((err) => {
					console.log(err);
				});
		}

		redirect(300, '/dash/supplier');
	}
};
