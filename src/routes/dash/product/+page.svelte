<script lang="ts">
	import { page } from '$app/state';
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
			<th scope="col">ខ្នាត</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th scope="col">ម៉ាកទំនិញ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_products as item, index}
			<tr>
				<td>{index}</td>
				<td></td>
				<td>{item.name}</td>
				<td>{item.barcode}</td>
				<td>{item.price}</td>
				<td>{item.stock}</td>
				<td>{item.unit.name}</td>
				<td>{item.category.name}</td>
				<td>{item.brand?.name}</td>
			</tr>
		{/each}
	</tbody>
</table>
