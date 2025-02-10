<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
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
				placeholder="ស្វែងរកតាមរយឈ្មេាះ..."
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
			<th scope="col">ឈ្មេាះទំនិញ</th>
			<th scope="col">បាកូដ</th>
			<th scope="col">តម្លៃ</th>
			<th scope="col">ចំនួន</th>

			<th scope="col">ប្រភេទទំនិញ</th>
			<th colspan="2" scope="col">ប្រេនទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_products as item, index}
			<tr>
				<td>{index}</td>
				<td></td>
				<td>{item.name}</td>
				<td>{item.barcode}</td>
				<td>$ {item.price}</td>
				<td>{item.stock} {item.unit.name} </td>
				<td>{item.category.name}</td>
				<td>{item.brand?.name}</td>
				<td>
					<div class="row">
						<div class="col-auto">
							<form action="?/delete" use:enhance method="post">
								<input type="hidden" name="product_id" value={item.id} />
								<AlertDelete />
							</form>
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
