<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_suppliers } = $derived(data);
	let q = $state('');
	let q_suppliers = $derived(
		get_suppliers.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<h4>បញ្ជីឈ្មោះអ្នកផ្គត់ផ្គង់</h4>
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
		<a href="/dash/supplier/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">ID#</th>
			<th scope="col">ឈ្មោះអ្នកផ្គត់ផ្គង់</th>
			<th scope="col">ក្រុមហ៊ុន</th>
			<th scope="col">អាស័យដ្នាន</th>
			<th scope="col">ទំនាក់ទំនង</th>
			<th>ការកែប្រែ</th>
		</tr>
	</thead>
	<tbody>
		{#each q_suppliers as item, index}
			<tr>
				<td> {index + 1} </td>
				<td> {item.name} </td>
				<td> {item.company_name} </td>
				<td> {item.address} </td>
				<td> {item.contact} </td>
				<td>
					<div class="row">
						<div class="col-auto">
							<AlertDelete action="?/delete">
								<input type="hidden" name="supplier_id" value={item.id} />
							</AlertDelete>
							
						</div>
						<div class="col">
							<a class="btn btn-outline-warning" href="/dash/supplier/create?supplier_id={item.id}"
								><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
		<NoData colspan={6} items={q_suppliers.length} />
	</tbody>
</table>
