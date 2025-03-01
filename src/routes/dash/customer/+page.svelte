<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_customers } = $derived(data);
	let q = $state('');
	let q_customers = $derived(
		get_customers.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<h4>បញ្ជីឈ្មោះអតិថិជន</h4>
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
		<a href="/dash/customer/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">ID#</th>
			<th scope="col">ឈ្មោះអតិថិជន</th>
			<th scope="col">រូបភាព</th>
			<th scope="col">អាស័យដ្នាន</th>
			<th scope="col">ទំនាក់ទំនង</th>
			<th>ការកែប្រែ</th>
		</tr>
	</thead>
	<tbody>
		{#each q_customers as item, index}
			<tr>
				<td> {index + 1} </td>
				<td> {item.name} </td>
				<td> {item.picture} </td>
				<td> {item.address} </td>
				<td> {item.contact} </td>
				<td>
					<div class="row">
						<div class="col-auto">
							<AlertDelete action="?/delete">
								<input type="hidden" name="customer_id" value={item.id} />
							</AlertDelete>
						</div>
						<div class="col">
							<a class="btn btn-outline-warning" href="/dash/customer/create?customer_id={item.id}"
								><i class="fa-solid fa-edit"></i> កែសម្រួល</a
							>
						</div>
					</div>
				</td>
			</tr>
		{/each}
		<NoData colspan={6} items={q_customers.length} />
	</tbody>
</table>
