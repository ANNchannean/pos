<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_brands } = $derived(data);
	let q = $state('');
</script>

<h4>បញ្ជីម៉ាកទំនិញ</h4>
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
		<a href="/dash/brand/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">ID#</th>
			<th scope="col">ឈ្មេាះម៉ាកទំនិញ</th>
			<th>ការកែប្រែ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_brands as brand, index}
			<tr>
				<td> {index + 1} </td>
				<td> {brand.name} </td>

				<td>
					<div class="row">
						<div class="col-auto">
							<form action="?/delete" use:enhance method="post">
								<input type="hidden" name="brand_id" value={brand.id} />
								<AlertDelete />
							</form>
						</div>
						<div class="col">
							<a class="btn btn-outline-warning" href="/dash/brand/create?brand_id={brand.id}"
								><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
