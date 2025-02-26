<script lang="ts">
	import { page } from '$app/state';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_products, get_exspend } = $derived(data);
	let product_id: null | number = $derived(Number(page.url.searchParams.get('product_id')) || null);
	let exspend_id: null | number = $derived(Number(page.url.searchParams.get('exspend_id')) || null);
</script>

<h4>ទិញផលិតផល</h4>
<hr />
<form onchange={(e) => e.currentTarget.requestSubmit()} method="get">
	<input type="hidden" name="exspend_id" value={exspend_id} />

	<div class="col-md-12">
		<div class="mb-2">
			<label for="product_name" class="form-label">ឈ្មោះផលិតផល</label>
			<select name="product_id" id="" class="form-control">
				{#each get_products as item}
					<option value={item?.id}>{item?.name ?? ''}</option>
				{/each}
			</select>
		</div>
	</div>
</form>
<Form action="?/create_inventory" method="POST">
	<input type="hidden" name="product_id" value={product_id} />
	<input type="hidden" name="exspend_id" value={exspend_id} />
	<div class="row mb-2">
		<div class="col-md-6">
			<label for="cost">តម្លៃទិញចូល</label>
			<input class="form-control" step="any" type="number" name="cost" id="cost" />
		</div>
		<div class="col-md-6">
			<label for="qty_bought">ចំនួនទិញចូល</label>
			<div class="input-group">
				<input class="form-control" step="any" type="number" name="qty_bought" id="qty_bought" />
				<select name="cost_unit_id" id="cost_unit_id" class="form-control">
					<option value={get_product?.unit_id}>{get_product?.unit.name}</option>
					{#each get_product?.subUnit || [] as item}
						<option value={item?.unit_id}>{item?.unit.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="form-check">
		<input
			value="not_count_stock"
			class="form-check-input"
			type="radio"
			name="count_stock"
			id="count_stock"
		/>
		<label class="form-check-label" for="count_stock">មិនរាប់ស្តុក</label>
	</div>
	<div class="form-check">
		<input
			value="count_stock"
			class="form-check-input"
			type="radio"
			name="count_stock"
			id="count_stock"
			checked
		/>
		<label class="form-check-label" for="count_stock"> រាប់ស្តុក </label>
	</div>

	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>

<table class="table">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">រូបភាព</th>
			<th scope="col">ឈ្មោះទំនិញ</th>
			<th scope="col">បាកូដ</th>
			<th scope="col">តម្លៃ</th>
			<th scope="col">ចំនួន</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th scope="col">ប្រេនទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_exspend?.inventory || [] as product_, index}
	
			{@const item = product_.product}
			<tr>
				<td>{index}</td>
				<td>
					<img class="img-thumbnail" style="height: 50px;" src="/uploads/{item?.image}" alt="" />
				</td>
				<td>{item?.name}</td>
				<td>{item?.barcode}</td>
				<td>$ {item?.price}</td>
				<td
					>{item?.stock}
					<a href="/dash/product/sub-unit?product_id={item?.id}">{item?.unit.name}</a>
				</td>
				<td>{item?.category.name}</td>
				<td>{item?.brand?.name}</td>
			</tr>
		{/each}
	</tbody>
</table>
