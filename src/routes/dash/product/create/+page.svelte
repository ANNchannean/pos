<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_product, get_categories, get_brands, get_units } = $derived(data);
</script>

<h4>បង្កើតផលិតផលថ្មី</h4>
<hr />

<form use:enhance action="?/create_product" method="post">
	{#if get_product?.id}
		<input type="hidden" name="product_id" value={get_product?.id} />
	{/if}
	<div class="mb-2">
		<label for="product_name" class="form-label">ឈ្មេាះផលិតផល</label>
		<input
			value={get_product?.name}
			type="text"
			class="form-control"
			name="product_name"
			id="product_name"
			placeholder="បញ្ជូលឈ្មេាះផលិតផល"
		/>
	</div>
	<div class="mb-2">
		<label for="barcode" class="form-label">បាកូដ</label>
		<input
			value={get_product?.barcode}
			type="text"
			class="form-control"
			name="barcode"
			id="barcode"
			placeholder="បញ្ជូលបាកូដ(មិនអាចដូចគ្នា)"
		/>
	</div>
	<div class="mb-2">
		<label for="price" class="form-label">តម្លៃ</label>
		<input
			value={get_product?.price}
			type="number"
			step="any"
			class="form-control"
			name="price"
			id="price"
			placeholder="តម្លៃត្រូវតែធំជាងសូន្យ"
		/>
	</div>
	<div class="mb-2">
		<label for="stock" class="form-label">ចំនួន</label>
		<input
			value={get_product?.stock}
			type="text"
			class="form-control"
			name="stock"
			id="stock"
			placeholder="ចំនួនបានទិញចូល"
		/>
	</div>
	<div class="mb-2">
		<label for="unit_id" class="form-label">ខ្នាត</label>
		<select value={get_product?.unit_id} class="form-control" name="unit_id" id="unit_id">
			{#each get_units as item}
				<option class="form-control" value={item.id}> {item.name}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="category_id" class="form-label">ប្រភេទទំនិញ</label>
		<select
			value={get_product?.category_id}
			class="form-control"
			name="category_id"
			id="category_id"
		>
			{#each get_categories as item}
				<option class="form-control" value={item.id}>{item.name}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="brand_id" class="form-label">ប្រេនទំនិញ</label>
		<select value={get_product?.brand_id} class="form-control" name="brand_id" id="brand_id">
			<option class="form-control" value="">None</option>
			{#each get_brands as item}
				<option class="form-control" value={item.id}>{item.name}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="description" class="form-label">ការបរិយាយ</label>
		<textarea
			value={get_product?.description}
			class="form-control"
			name="description"
			id="description"
		></textarea>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</form>
