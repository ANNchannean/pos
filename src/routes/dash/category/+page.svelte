<script lang="ts">
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_categoryies } = $derived(data);
	let q = $state('');
	let q_categories = $derived(
		get_categoryies?.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<h4>បញ្ជីប្រភេទទំនិញ</h4>
<hr />
<div class="row pb-1">
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
		<a href="/dash/category/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<div style="height: {store.inerHight};" class="table-responsive overflow-x-hidden">
	<table class="table table-light">
		<thead style="z-index: 1;" class="sticky-top position-sticky table-active">
		<tr>
			<th scope="col">ID#</th>
			<th scope="col">ឈ្មោះប្រភេទទំនិញ</th>
			<th>ការកែប្រែ</th>
		</tr>
	</thead>
	<tbody>
		{#each q_categories as category, index}
			<tr>
				<td> {index + 1} </td>
				<td> {category.name} </td>

				<td>
					<div class="row">
						<div class="col-auto">
							<AlertDelete action="?/delete">
								<input type="hidden" name="category_id" value={category.id} />
							</AlertDelete>
						</div>
						<div class="col">
							<a
								class="btn btn-outline-warning"
								href="/dash/category/create?category_id={category.id}"
							>
								<i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
		<NoData colspan={3} items={q_categories.length} />
	</tbody>
</table>
</div>