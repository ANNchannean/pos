<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_categoryies } = $derived(data);
	let q = $state('');
	let q_categories = $derived(get_categoryies?.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()) ))
	
</script>

<h4>បញ្ជីប្រភេទទំនិញ</h4>
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
		<a href="/dash/category/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<table class="table">
	<thead>
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
							<form action="?/delete" use:enhance method="post">
								<input type="hidden" name="category_id" value={category.id} />
								<AlertDelete/>
							</form>
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
