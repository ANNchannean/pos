<script lang="ts">
	import { page } from '$app/state';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import DatetimeFormat from '$lib/component/DatetimeFormat.svelte';
	import HandleQ from '$lib/component/HandleQ.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import Paginations from '$lib/component/Paginations.svelte';
	import SelectParam from '$lib/component/SelectParam.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_invoices, items } = $derived(data);
	let n = $state(1);
</script>

<h4 class="">របាយការណ៌អតិថិជនជំពាក់</h4>
<hr />
<div class="row pb-1">
	<div class="col-auto">
		<Paginations {items} bind:n />
	</div>

	<div class="col-auto">
		<HeaderQuery>
			<div style="width: 250px;">
				<div class="input-group">
					<span class="input-group-text">ចាប់ពី</span>
					<input type="date" name="start" class="form-control" />
				</div>
			</div>
			<div style="width: 250px;">
				<div class="input-group">
					<span class="input-group-text">រហូត់ដល់</span>
					<input type="date" name="end" class="form-control" />
				</div>
			</div>
			<!-- <div class="col-auto">
				<button type="reset" class="btn btn-warning">សំអាត</button>
			</div> -->

			<!-- <div style="width: 300px;" class="col-auto">
				<SelectParam placeholder="ស្វែងរកតាមប្រេនទំនិញ" name="brand_id" items={get_brands} />
			</div> -->
			<!-- <div style="width: 300px;" class="col-auto">
				<SelectParam
					placeholder="ស្វែងរកតាមប្រភេទទំនិញ"
					name="category_id"
					items={get_categories}
				/>
			</div> -->
		</HeaderQuery>
	</div>
</div>
<div style="height: {store.inerHight};" class="table-responsive overflow-x-hidden">
	<table class="table table-light">
		<thead style="z-index: 1;" class="sticky-top position-sticky table-active">
			<tr>
				<th scope="col">#</th>
				<th scope="col">កាលបរិច្ឋេទ</th>
				<th scope="col">អតិថិជន</th>
				<th scope="col">អ្នកលក់</th>
				<th scope="col">ប្រាក់សរុប</th>
				<th scope="col">បញ្ចុះតម្លៃ</th>
				<th scope="col">សរុបចុងក្រោយ</th>
				<th scope="col">ស្ថានភាព</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each get_invoices as invoice, index}
				<tr>
					<td>{n + index}</td>
					<td><DatetimeFormat date={invoice.created_at} /></td>
					<td>{invoice.customer?.name || 'ទូទៅ'}</td>
					<td> {invoice.seller.username} </td>
					<td> $ {invoice.amount}</td>
					<td>
						{#if (!invoice.discount?.includes('%') && Number(invoice.discount)) || 0 > 0}
							$ {invoice.discount}
						{:else}
							{invoice.discount}
						{/if}
					</td>
					<td> $ {invoice.total}</td>
					<td>
						{#if invoice.status === 'debt'}
							<a href="/dash/pos?invoice_id={invoice.id}" class="btn btn-link">ជំពាក់</a>
						{:else}
							មិនជំពាក់
						{/if}
					</td>
					<td>
						<div class="row g-0">
							<div class="col-2">
								<a
									aria-label={invoice.id.toString()}
									href="/dash/pos?invoice_id={invoice.id}&customer_id={invoice.customer_id}"
									class="btn btn-link text-warning"><i class="fa-solid fa-file-pen"></i></a
								>
							</div>
							<div class="col-2">
								<a
									aria-label={invoice.id.toString().concat('print')}
									href="/dash/report/print?invoice_id={invoice.id}"
									class="btn btn-link text-warning"><i class="fa-solid fa-print"></i></a
								>
							</div>
							<div class="col-2">
								<AlertDelete action="?/delete" name="" class="col-auto btn btn-link text-danger">
									<input type="hidden" name="id" value={invoice.id} />
								</AlertDelete>
							</div>
						</div>
					</td>
				</tr>
			{/each}

			<NoData colspan={8} items={get_invoices.length} />
		</tbody>
	</table>
</div>
