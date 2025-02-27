<script lang="ts">
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let { get_products } = $derived(data);
	let q = $state('');
</script>

<h4>បញ្ជីផលិតផល</h4>
<hr />
<div class="row">
	<div class="col-4">
		<form data-sveltekit-keepfocus action="?/search" method="get">
			<input
				bind:value={q}
				name="q"
				placeholder="ស្វែងរកតាមរយឈ្មោះ..."
				type="search"
				class="form-control"
			/>
		</form>
	</div>
	<div class="col-4">
		<a href="/dash/product/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">រូបភាព</th>
			<th scope="col">ឈ្មោះទំនិញ</th>
			<th scope="col">បាកូដ</th>
			<th scope="col">តម្លៃ</th>
			<th scope="col">ចំនួនមាន</th>
			<th scope="col">ខ្នាតដុំ</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th colspan="2" scope="col">ប្រេនទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_products as item, index}
			{@const qty_avallable = item.inventory.reduce((s, e) => s + Number(e.qty_available), 0)}
			<tr>
				<td>{index+1}</td>
				<td>
					<img class="img-thumbnail" style="height: 50px;" src="/uploads/{item.image}" alt="" />
				</td>
				<td>
					<div>
						<a class="text-decoration-none" href="/dash/product/history?product_id={item.id}">
							{item.name}
						</a>
					</div>
				</td>
				<td>{item.barcode}</td>
				<td>$ {item.price}</td>
				<td>
					<div>
						<a class="text-decoration-none" href="/dash/product/sub-unit?product_id={item.id}">
							{qty_avallable}
							{item.unit.name}
						</a>
					</div>
				</td>
				<td>
					<div>
						{#each item.subUnit || [] as sub_unit}
							{(qty_avallable / sub_unit.qty_per_unit).toFixed()} {sub_unit.unit.name} <br />
						{/each}
						{#if !item.subUnit.length}
							...
						{/if}
					</div>
				</td>
				<td>{item.category.name}</td>
				<td>{item.brand?.name}</td>
				<td>
					<div class="row g-1">
						<div class="col-auto">
							<Form action="?/delete" method="POST">
								<input type="hidden" name="product_id" value={item.id} />
								<AlertDelete />
							</Form>
						</div>
						<div class="col">
							<a class="btn btn-outline-warning" href="/dash/product/create?product_id={item.id}"
								><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
		<NoData colspan={9} items={get_products.length} />
	</tbody>
</table>
