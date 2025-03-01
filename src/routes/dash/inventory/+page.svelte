<script lang="ts">
	import { page } from '$app/state';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_products, get_exspend, get_inventory } = $derived(data);
	let inventory_id: null | number = $derived(
		Number(page.url.searchParams.get('inventory_id')) || null
	);
	let exspend_id: null | number = $derived(Number(page.url.searchParams.get('exspend_id')) || null);
	let product_id: null | number = $derived(Number(page.url.searchParams.get('product_id')) || null);
</script>

<h4>ទិញផលិតផល</h4>
<hr />
<form onchange={(e) => e.currentTarget.requestSubmit()} method="get">
	<input type="hidden" name="exspend_id" value={exspend_id} />
	<div class="col-md-12">
		<div class="mb-2">
			<label for="product_id" class="form-label">ឈ្មោះផលិតផល</label>
			<select
				disabled={inventory_id ? true : false}
				name="product_id"
				id="product_id"
				class="form-control"
			>
				{#each get_products as item}
					<option selected={item.id === get_inventory?.product_id} value={item?.id}
						>{item?.name ?? ''}</option
					>
				{/each}
			</select>
		</div>
	</div>
</form>
<Form action="?/create_inventory" method="POST">
	<input type="hidden" name="inventory_id" value={inventory_id} />
	<input type="hidden" name="exspend_id" value={exspend_id} />
	<input type="hidden" name="product_id" value={product_id} />
	<div class="row mb-2">
		<div class="col-md-6">
			<label for="cost">តម្លៃទិញចូល</label>
			<input
				value={get_inventory?.cost}
				class="form-control"
				step="any"
				type="number"
				name="cost"
				id="cost"
			/>
		</div>
		<div class="col-md-6">
			<label for="qty_bought">ចំនួនទិញចូល</label>
			<div class="input-group">
				<input
					value={get_inventory?.qty_bought}
					class="form-control"
					step="any"
					type="number"
					name="qty_bought"
					id="qty_bought"
				/>
				<select name="cost_unit_id" id="cost_unit_id" class="form-control">
					<option
						selected={get_product?.unit_id === get_inventory?.cost_unit_id}
						value={get_product?.unit_id}>{get_product?.unit.name}</option
					>
					{#each get_product?.subUnit || [] as item}
						<option selected={item.unit_id === get_inventory?.cost_unit_id} value={item?.unit_id}
							>{item?.unit.name}</option
						>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="form-check">
		<input
			value="false"
			class="form-check-input"
			type="radio"
			name="count_stock"
			id="count_stock"
			checked={get_inventory?.is_count_stock ? true : false}
		/>
		<label class="form-check-label" for="count_stock">មិនរាប់ស្តុក</label>
	</div>
	<div class="form-check">
		<input
			value="true"
			class="form-check-input"
			type="radio"
			name="count_stock"
			id="not_count_stock"
			checked={!get_inventory?.is_count_stock ? true : false}
		/>
		<label class="form-check-label" for="not_count_stock"> រាប់ស្តុក </label>
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
			<th scope="col">តម្លៃទិញចូល</th>
			<th scope="col">ខ្នាត</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th colspan="2" scope="col">ប្រេនទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_exspend?.inventory || [] as inventory, index}
			{@const item = inventory.product}
			<tr>
				<td>{index}</td>
				<td>
					<img class="img-thumbnail" style="height: 50px;" src="/uploads/{item?.image}" alt="" />
				</td>
				<td>{item?.name}</td>
				<td>{item?.barcode}</td>
				<td>$ {inventory.cost} {inventory.constUnit?.name} </td>
				<td>
					{item?.unit.name}
				</td>
				<td>{item?.category.name}</td>
				<td>{item?.brand?.name}</td>
				<td>
					<div class="row g-1">
						<div class="col-auto">
							<AlertDelete action="?/delete">
								<input type="hidden" name="inventory_id" value={item.id} />
								<input type="hidden" name="exspend_id" value={inventory.exspend_id} />
							</AlertDelete>
						</div>
						<div class="col">
							<a
								href="/dash/inventory?inventory_id={inventory_id !== inventory.id
									? inventory.id
									: ''}&exspend_id={inventory.exspend_id}&product_id={inventory.product_id}"
								class:active={inventory_id === inventory.id}
								class="btn btn-outline-warning"><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
