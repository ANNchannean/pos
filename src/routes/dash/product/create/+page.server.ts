import { db } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { product } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { updateFile, uploadFile } from '$lib/server/fileHandle';

// រុញទិន្នន័យទៅ Client  តាមរយៈ Load Function
export const load = (async ({ url }) => {
	const product_id = url.searchParams.get('product_id');
	const get_product = await db.query.product.findFirst({
		where: eq(product.id, Number(product_id))
	});
	const get_categories = await db.query.category.findMany();
	const get_brands = await db.query.brand.findMany();
	const get_units = await db.query.unit.findMany();
	return {
		get_product,
		get_categories,
		get_brands,
		get_units
	};
}) satisfies PageServerLoad;

// ទទូលសំណើរមកពីClient តាមរយៈ Actions Form
export const actions: Actions = {
	create_product: async ({ request }) => {
		const body = await request.formData();
		const {
			product_name,
			product_id,
			barcode,
			price,
			category_id,
			brand_id,
			unit_id,
			description,
			old_image,
			model,
			condition
		} = Object.fromEntries(body) as Record<string, string>;
		const file = body.get('image') as File;

		// ពិនិត្យមើលទិន្ន័យដែលគ្មាន
		const validProduct = {
			product_name: false,
			barcode: false,
			price: false,
			category_id: false,
			brand_id: false,
			unit_id: false,
			description: false
		};
		if (!product_name) validProduct.product_name = true;
		if (!barcode) validProduct.barcode = true;
		if (!price) validProduct.price = true;

		if (!category_id) validProduct.category_id = true;
		if (!brand_id) validProduct.brand_id = true;
		if (!unit_id) validProduct.unit_id = true;
		if (!description) validProduct.description = true;
		if (Object.values(validProduct).includes(true)) return fail(400, validProduct); // ហាមប៉ះពាល
		// បញ្ជប់ការពិនិ្យ
		//ករណី produts មានស្រាប់ ត្រូវ Update
		if (product_id) {
			await db
				.update(product)
				.set({
					name: product_name,
					barcode: barcode,
					price: +price,
					model: model,
					condition: condition,
					category_id: +category_id,
					brand_id: brand_id ? +brand_id : null,
					unit_id: +unit_id,
					description: description,
					image: file.size ? await updateFile(file, old_image) : undefined
				})
				.where(eq(product.id, Number(product_id)));
		}
		if (!product_id) {
			const image = await uploadFile(file);
			await db.insert(product).values({
				name: product_name,
				barcode: barcode,
				price: +price,
				model: model,
				condition: condition,
				image: image,
				category_id: +category_id,
				brand_id: brand_id ? +brand_id : null,
				unit_id: +unit_id,
				description: description
			});
		}

		redirect(300, '/dash/product');
	}
};
