<script lang="ts">
	import { page } from '$app/state';
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
		</tr>
	</thead>
	<tbody>
		{#each get_brands as brand}
			<tr>
				<td>{brand.id} </td>
				<td> {brand.name} </td>
			</tr>
		{/each}
	</tbody>
</table>
