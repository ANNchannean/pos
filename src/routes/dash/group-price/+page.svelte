<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import DatetimeFormat from '$lib/component/DatetimeFormat.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_sample_invoice } = $derived(data);
</script>

<h4>បញ្ជីកញ្ចប់តម្លៃ</h4>
<hr />
<div class="row pb-1">
	<div class="col-4">
		<form data-sveltekit-keepfocus action="?/search" method="get">
			<input name="q" placeholder="ស្វែងរកតាមរយឈ្មោះ..." type="search" class="form-control" />
		</form>
	</div>
	<div class="col-4">
		<a href="/dash/group-price/create" class="btn btn-warning">បង្កើតកញ្ចប់តម្លៃ</a>
	</div>
</div>
<div style="height: {store.inerHight};" class="table-responsive overflow-x-hidden">
	<table class="table table-light">
		<thead style="z-index: 1;" class="sticky-top position-sticky table-active">
			<tr>
				<th scope="col">ID#</th>
				<th scope="col">ឈ្មោះកញ្ចប់តម្លៃ</th>
				<th scope="col">ការពិពណ៌នា</th>
				<th scope="col">តម្លៃ</th>
				<th>ការកែប្រែ</th>
			</tr>
		</thead>
		<tbody>
			{#each get_sample_invoice as item, index}
				<tr>
					<td> {index + 1} </td>
					<td> {item.name} </td>
					<td>
						<span class="text-break">
							{item.note}
						</span>
					</td>
					<td>
						$ {item.amount}
					</td>

					<td>
						<div class="row g-1">
							<div class="col-auto">
								<AlertDelete action="?/delete">
									<input type="hidden" name="id" value={item.id} />
								</AlertDelete>
							</div>
							<div class="col-auto">
								<a
									class="btn btn-outline-warning"
									href="/dash/group-price/create?sample_invoice_id={item.id}"
									><i class="fa-solid fa-edit"></i> កែសម្រួល</a
								>
							</div>
							<div class="col">
								<a
									class="btn btn-outline-primary"
									href="/dash/pos/?sample_invoice_id={item.id}"
									><i class="fa-solid fa-edit"></i> ចូលលក់</a
								>
							</div>
						</div>
					</td>
				</tr>
			{/each}
			<NoData colspan={5} items={get_sample_invoice.length} />
		</tbody>
	</table>
</div>
