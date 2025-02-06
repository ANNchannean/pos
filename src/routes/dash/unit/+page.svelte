<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_units } = $derived(data);
	let q = $state('');
	let q_units = $derived(get_units.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()) ))
</script>

<h4>បញ្ជីខ្នាត</h4>
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
		<a href="/dash/unit/create" class="btn btn-warning">បង្កើតថ្មី</a>
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
		{#each q_units as unit, index}
			<tr>
				<td> {index + 1} </td>
				<td> {unit.name} </td>
				<td>
					<div class="row">
						<div class="col-auto">
							<form action="?/delete" use:enhance method="post">
								<input type="hidden" name="unit_id" value={unit.id} />
								<AlertDelete />
							</form>
						</div>
						<div class="col">
							<a class="btn btn-outline-warning" href="/dash/unit/create?unit_id={unit.id}"
								><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
		{#if q_units.length === 0}
			<tr>
				<td colspan="3" class="text-center">គ្មានទិន្ន័យទេ</td>
			</tr>
			
		{/if}
	</tbody>
</table>
