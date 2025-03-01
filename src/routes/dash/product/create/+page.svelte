<script lang="ts">
	import CropImage from '$lib/component/CropImage.svelte';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_categories, get_brands, get_units } = $derived(data);
</script>

<h4>បង្កើតផលិតផលថ្មី</h4>
<hr />
<Form action="?/create_product" enctype="multipart/form-data" method="POST">
	{#if get_product?.id}
		<input type="hidden" name="product_id" value={get_product?.id} />
		<input type="hidden" name="old_image" value={get_product?.image} />
	{/if}
	<div class="row">
		<div class="col-md-6">
			<div class="mb-2">
				<label for="product_name" class="form-label">ឈ្មោះផលិតផល</label>
				<input
					value={get_product?.name}
					type="text"
					class="form-control"
					name="product_name"
					id="product_name"
					placeholder="បញ្ជូលឈ្មោះផលិតផល"
				/>
				{#if form?.product_name}
					<p class="text-danger">ឈ្មោះទំនិញត្រូវតែមាន</p>
				{/if}
			</div>
		</div>
		<div class="col-md-6">
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
				{#if form?.barcode}
					<p class="text-danger">បាកូដត្រូវតែមាន</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div class="mb-2">
				<label for="price" class="form-label">ម៉ូដែល</label>
				<input
					value={get_product?.model}
					type="text"
					class="form-control"
					name="model"
					id="model"
				/>
			</div>
		</div>
		<div class="col-md-6">
			<div class="mb-2">
				<label for="condition" class="form-label">ល័ក្ខខ័ណ</label>
				<select value={get_product?.condition} class="form-control" name="condition" id="condition">
					<option class="form-control" value="NEW">
						NEW</option
					>
					<option class="form-control" value="SECONDHAND">
						SECONDHAND</option
					>
					
				</select>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
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
				{#if form?.price}
					<p class="text-danger">តម្លៃត្រូវតែធំជាងសូន្យ</p>
				{/if}
			</div>
		</div>
		<div class="col-md-6">
			<div class="mb-2">
				<label for="unit_id" class="form-label">ខ្នាត</label>
				<select value={get_product?.unit_id} class="form-control" name="unit_id" id="unit_id">
					<option class="form-control" value="">None</option>
					{#each get_units as item}
						<option class="form-control" value={item.id}> {item.name}</option>
					{/each}
				</select>
				{#if form?.unit_id}
					<p class="text-danger">ខ្នាតត្រូវតែមាន</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div class="mb-2">
				<label for="category_id" class="form-label">ប្រភេទទំនិញ</label>
				<select
					value={get_product?.category_id}
					class="form-control"
					name="category_id"
					id="category_id"
				>
					<option class="form-control" value="">None</option>
					{#each get_categories as item}
						<option class="form-control" value={item.id}>{item.name}</option>
					{/each}
				</select>
				{#if form?.category_id}
					<p class="text-danger">ប្រភេទទំនិញត្រូវតែមាន</p>
				{/if}
			</div>
		</div>
		<div class="col-md-6">
			<div class="mb-2">
				<label for="brand_id" class="form-label">ប្រេនទំនិញ</label>
				<select value={get_product?.brand_id} class="form-control" name="brand_id" id="brand_id">
					<option class="form-control" value="">None</option>
					{#each get_brands as item}
						<option class="form-control" value={item.id}>{item.name}</option>
					{/each}
				</select>
				{#if form?.brand_id}
					<p class="text-danger">ប្រេនទំនិញត្រូវតែមាន</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="mb-2">
		<label for="description" class="form-label">ការបរិយាយ</label>
		<textarea
			value={get_product?.description}
			class="form-control"
			name="description"
			id="description"
		></textarea>
		{#if form?.description}
			<p class="text-danger">ការបរិយាយត្រូវតែមាន</p>
		{/if}
	</div>
	<div class="row mb-2">
		<div class="col-md-12">
			<label for="description" class="form-label">រូបភាព</label>
			<CropImage name="image" />
		</div>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
