<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import DatetimeFormat from '$lib/component/DatetimeFormat.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_exspends } = $derived(data);
</script>

<h4>បញ្ជីការចំណាយ</h4>
<hr />
<div class="row">
	<div class="col-4">
		<form data-sveltekit-keepfocus action="?/search" method="get">
			<input name="q" placeholder="ស្វែងរកតាមរយឈ្មោះ..." type="search" class="form-control" />
		</form>
	</div>
	<div class="col-4">
		<a href="/dash/exspend/create" class="btn btn-warning">បញ្ចូលការចំណាយ</a>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">ID#</th>
			<th scope="col">សរុបចំណាយ</th>
			<th scope="col">ចំណាយលើ</th>
			<th scope="col">កាលបរិច្ឋេទ</th>
			<th scope="col">អ្នកចំណាយ</th>
			<th>ការកែប្រែ</th>
		</tr>
	</thead>
	<tbody>
		{#each get_exspends as item, index}
			<tr>
				<td> {index + 1} </td>
				<td> {item.amount} </td>
				<td>
					<span class="text-break">
						{item.reason}
					</span>
				</td>
				<td>
					<DatetimeFormat date={item.created_at} />
				</td>
				<td> {item.user.username} </td>
				<td>
					<div class="row g-1">
						<div class="col-auto">
							<form action="?/delete" use:enhance method="post">
								<input type="hidden" name="exspend_id" value={item.id} />
								<AlertDelete />
							</form>
						</div>
						<div class="col">
							{#if item.inventory.length}
								<a class="btn btn-outline-warning" href="/dash/inventory?exspend_id={item.id}"
									><i class="fa-solid fa-edit"></i> កែសម្រួល</a
								>
							{:else}
								<a class="btn btn-outline-warning" href="/dash/exspend/create?exspend_id={item.id}"
									><i class="fa-solid fa-edit"></i> កែសម្រួល</a
								>
							{/if}
						</div>
					</div>
				</td>
			</tr>
		{/each}
		<NoData colspan={6} items={get_exspends.length} />
	</tbody>
</table>
