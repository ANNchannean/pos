<script lang="ts">
	import DatetimeFormat from '$lib/component/DatetimeFormat.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let { get_invoice, get_company } = $derived(data);
	function printDiv(divName: string) {
		var printContents = document.getElementById(divName)?.innerHTML;
		var originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents as string;
		window.print();
		document.body.innerHTML = originalContents;
	}
</script>

<!-- Invoice 1 - Bootstrap Brain Component -->

<div id="scall" class="row justify-content-center">
	<div style="width: 1200px;">
		<div class="header">
			<div class="row pt-2">
				<div class="col-auto text-center">
					<img
						id="imgp1"
						height="150px"
						class="float-right"
						src="/uploads/{get_company?.logo}"
						alt="no logo"
					/>
				</div>
				<div style="margin-left: 200px;" class="col text-primary">
					<p style="font-size: 60px;" class="kh_font_muol_light m-0">
						{get_company?.name_khmer ?? ''}
					</p>
					<p style="font-size: 50px;" class=" m-0 ms-4">
						{get_company?.name_english ?? ''}
					</p>
				</div>
				<hr />
			</div>
			<div class="row g-0 justify-content-between fs-3">
				<div class="col-5">
					<div>លេខវិក្កយបត្រ: {get_invoice?.id}</div>
					<div>កាលបរិច្ឆេទ: <DatetimeFormat date={get_invoice?.created_at} /></div>
					<div>អ្នកលក់: {get_invoice?.seller.username}</div>
					<div>អតិថិជន: {get_invoice?.customer?.name || 'ទូទៅ'}</div>
					<div>អាស័យដ្នាន: {get_invoice?.customer?.address || ''}</div>
					<div>ទំនាក់ទំនង: {get_invoice?.customer?.contact || ''}</div>
				</div>
				<div class="col-2">
					<u class="text-center fs-3">
						<h3>វិក្កយបត្រ</h3>
						<h3>Invoice</h3>
					</u>
				</div>
				<div style="text-align: justify;" class="col-5">
					<div>
						អាស័យដ្នាន: {get_company?.address ?? ''}
					</div>
					<div>
						ទំនាក់ទំនង: {get_company?.contact ?? ''}
					</div>
					<div>
						{get_company?.description ?? ''}
					</div>
				</div>
			</div>
		</div>

		<table class="table table-bordered fs-3 border border-dark border-1">
			<thead>
				<tr class="table-active table table-light border border-dark border-1">
					<td class=" border border-dark border-1" style="width: 3%;">ល.រ</td>
					<td class=" border border-dark border-1" style="width: 60%;">ឈ្មោះទំនិញ</td>
					<td class="text-center border border-dark border-1" style="width: 10%;">ចំនួន</td>
					<td class="text-center border border-dark border-1" style="width: 10%;">តម្លៃ</td>
					<td class="text-center border border-dark border-1" style="width: 17%;">សរុប</td>
				</tr>
			</thead>
			<tbody>
				{#each get_invoice?.productOrders || [] as item, index (item.id)}
					<tr class="border border-dark border-1">
						<td class="text-center border border-dark border-1">{index + 1}</td>
						<td class="text-wrap border border-dark border-1">{item.product.name}</td>
						<td class="text-center text-wrap border border-dark border-1"
							>{item.quantity} {item.unit.name}</td
						>
						<td class="text-center border border-dark border-1">$ {item.price}</td>
						<td class=" border border-dark border-1">$ {item.total}</td>
					</tr>
				{/each}
				<tr>
					<td
						style="vertical-align: top;"
						class="border border-bottom-0 border-0"
						rowspan="3"
						colspan="2"
					>
						<div class="text-break text-start fs-6">
							{get_company?.note}
						</div>
					</td>
					<td colspan="2" class="text-end border-bottom-0 border border-dark border-1">
						<div>ប្រាក់សរុប​</div>
					</td>
					<td class="border border-dark border-1 border border-dark border-1" colspan="1">
						<div>$ {get_invoice?.amount}</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="text-end border-bottom-0 border border-dark border-1">
						<div>បញ្ចុះតម្លៃ</div>
					</td>
					<td class="border border-dark border-1" colspan="1">
						<div>
							{#if (!get_invoice?.discount?.includes('%') && Number(get_invoice?.discount)) || 0 > 0}
								$ {get_invoice?.discount}
							{:else}
								{get_invoice?.discount}
							{/if}
						</div>
					</td>
				</tr>
				<tr class="border-bottom-0">
					<td colspan="2" class="text-end border-bottom-0 border border-dark border-1">
						<div>សរុបចុងក្រោយ</div>
					</td>
					<td class="border border-dark border-1" colspan="1">
						<div>$ {get_invoice?.total}</div>
					</td>
				</tr>
				{#if get_invoice?.note}
					<tr>
						<td colspan="5">{get_invoice?.note}</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<div class="footer">
			<div style="font-size: 110%;" class="en_font_times_new_roman row fs-3">
				<div class="col-6 text-center">
					<span>------------------------</span>
					<br />
					<span>ហត្ថលេខានឹងឈ្មោះអ្នកបង់ប្រាក់</span>
					<br />
					<span>Sign's Payment and Name</span>
				</div>
				<div class="col-6 text-center">
					<span>------------------------</span>
					<br />
					<span>ហត្ថលេខានឹងឈ្មោះអ្នកទទួលប្រាក់</span>
					<br />
					<span>Sign's Cashier and Name</span>
				</div>
			</div>
		</div>
	</div>
</div>
