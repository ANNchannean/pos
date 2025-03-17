<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_users } = $derived(data);
	let q = $state('');
	let q_users = $derived(
		get_users.filter((e) => e.username?.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<h4>បញ្ជីឈ្មោះបុគ្គលិក</h4>
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
		<a href="/dash/account/create" class="btn btn-warning">បង្កើតថ្មី</a>
	</div>
</div>
<div style="height: {store.inerHight};" class="table-responsive overflow-x-hidden">
	<table class="table table-light">
		<thead style="z-index: 1;" class="sticky-top position-sticky table-active">
			<tr>
				<th scope="col">ID#</th>
				<th scope="col">ឈ្មោះបុគ្គលិក</th>
				<th scope="col">សិទ្ធ</th>
				<th scope="col">អាស័យដ្នាន</th>
				<th scope="col">ទំនាក់ទំនង</th>
				<th>ការកែប្រែ</th>
			</tr>
		</thead>
		<tbody>
			{#each q_users as item, index}
				<tr>
					<td> {index + 1} </td>
					<td> {item.username} </td>
					<td> {item.role} </td>
					<td> {item.address} </td>
					<td> {item.contact} </td>
					<td>
						<div class="row">
							<div class="col-auto">
								<AlertDelete action="?/delete">
									<input type="hidden" name="user_id" value={item.id} />
								</AlertDelete>
							</div>
							<div class="col">
								<a class="btn btn-outline-warning" href="/dash/account/create?user_id={item.id}"
									><i class="fa-solid fa-edit"></i> កែសម្រួល</a
								>
							</div>
						</div>
					</td>
				</tr>
			{/each}
			<NoData colspan={6} items={q_users.length} />
		</tbody>
	</table>
</div>
