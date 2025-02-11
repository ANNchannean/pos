import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { customer } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ url }) => {
	const customer_id = url.searchParams.get('customer_id');
	const get_customer = await db.query.customer.findFirst({
		where: eq(customer.id, Number(customer_id))
	});

	return {
		get_customer
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	// សម្រាប់កង្កើតប្រភេទទំនិញថ្មី
	create_customer: async ({ request }) => {
		const body = await request.formData();
		const { customer_name, customer_address, customer_contact, customer_id } = Object.fromEntries(body) as Record<string, string> 

		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន
		const validCustomer = {
			name: false,
			contact: false,
			adddress: false,
		}
		if (!customer_name) validCustomer.name = true
		if (!customer_contact) validCustomer.contact = true
		if (!customer_address) validCustomer.adddress = true
		if (Object.values(validCustomer).includes(true)) return fail(400, validCustomer);
		// បញ្ជប់ការពិនិ្យ
		if (customer_id) {
			await db
				.update(customer)
				.set({
					name: customer_name,
					address: customer_address,
					contact: customer_contact
				})
				.where(eq(customer.id, Number(customer_id)))
				.catch((err) => {
					console.log(err)
				})
		}
		if (!customer_id) {
			await db.insert(customer).values({
				name: customer_name,
				address: customer_address,
				contact: customer_contact
			})
				.catch((err) => {
					console.log(err)
				})
		}

		redirect(300, '/dash/customer');
	}
};
