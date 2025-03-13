<script lang="ts">
	import { page } from '$app/state';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import SelectParam from '$lib/component/SelectParam.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_products, get_sample_invoice } = $derived(data);
	let sample_invoice_id: null | number = $derived(
		Number(page.url.searchParams.get('sample_invoice_id')) || null
	);
	let product_id: null | number = $derived(Number(page.url.searchParams.get('product_id')) || null);
</script>

<h4>កញ្ចប់តម្លៃ</h4>
<hr />

<div class="col-md-12">
	<div class="mb-2">
		<label for="product_id" class="form-label">ឈ្មោះផលិតផល</label>
		<!-- <SearchProductSubmit
				q_name="q"
				name="product_id"
				placeholder="ស្វែងរកឈ្មោះផលិតផល"
				items={get_products.map((e) => ({ id: e.id, name: e.name }))}
			/> -->
		<SelectParam
			name="product_id"
			q_name="product_q"
			value={get_product?.id}
			placeholder="ស្វែងរកឈ្មោះផលិតផល"
			items={get_products.map((e) => ({ id: e.id, name: e.name }))}
		/>
	</div>
</div>

<Form action="?/create_sample_invoice" method="POST">
	<input type="hidden" name="sample_invoice_id" value={sample_invoice_id} />
	<input type="hidden" name="product_id" value={product_id} />
	<div class="row mb-2">
		<div class="col-md-12">
			<label for="qty">ចំនួន</label>
			<div class="input-group">
				<input class="form-control" step="any" type="number" name="qty" id="qty" />
				<select name="unit_id" id="unit_id" class="form-control">
					<option value={get_product?.unit_id}>{get_product?.unit.name}</option>
					{#each get_product?.subUnit || [] as item}
						<option value={item?.unit_id}>{item?.unit.name}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>

<table class="table table-light">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">រូបភាព</th>
			<th style="width: 40%;" scope="col">ឈ្មោះទំនិញ</th>
			<th scope="col">បាកូដ</th>
			<th scope="col">ខ្នាត</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th colspan="2" scope="col">ប្រេនទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_sample_invoice?.productOrders || [] as product_order, index}
			{@const item = product_order}
			<tr>
				<td>{index + 1}</td>
				<td>
					<img
						class="img-thumbnail"
						style="height: 50px;"
						src={item?.product?.image ? `/uploads/${item?.product?.image}` : `/no-image.png`}
						alt=""
					/>
				</td>
				<td>{item?.product.name}</td>
				<td>{item?.product?.barcode}</td>
				<td>
					{item?.quantity}
					{item?.unit?.name}
				</td>
				<td>{item?.product?.category.name}</td>
				<td>{item?.product?.brand?.name}</td>
				<td>
					<div class="row g-1">
						<div class="col-auto">
							<AlertDelete action="?/delete">
								<input type="hidden" name="product_order_id" value={item.id} />
							</AlertDelete>
						</div>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
<Form action="?/update_sample_invoice" method="POST">
	<input type="hidden" name="sample_invoice_id" value={sample_invoice_id} />
	<div class="mb-2">
		<label for="name">ឈ្មេាះកញ្ចប់តម្លៃ</label>
		<input
			value={get_sample_invoice?.name}
			class="form-control"
			type="text"
			name="name"
			id="name"
		/>
	</div>
	<div class="mb-2">
		<label for="note">ការពិពណ៌នា</label>
		<textarea value={get_sample_invoice?.note} class="form-control" name="note" id="note"
		></textarea>
	</div>
	<div class="mb-2">
		<label for="amount">តម្លៃ</label>
		<input
			value={get_sample_invoice?.amount}
			class="form-control"
			type="number"
			step="any"
			name="amount"
			id="amount"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
<br />
