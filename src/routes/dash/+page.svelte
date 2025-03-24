<script lang="ts">
	import { page } from '$app/state';
	import Barcode from '$lib/component/Barcode.svelte';
	import Form from '$lib/component/Form.svelte';
	import Graphs from '$lib/component/Graphs.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import type { PageServerData } from './$types';
	import QRCode from 'qrcode';
	let { data }: { data: PageServerData } = $props();
	let { count_product, count_user, count_customer, exspend, income, get_invoices, get_exspends } =
		$derived(data);
	let report: 'sale' | 'exspend' | 'out_stock' = $state('sale');
	let start = $derived(page.url.searchParams.get('start') || '');
	let end = $derived(page.url.searchParams.get('end') || '');
	let prompt_data = $state('');
</script>

<div class="container">
	<div class="row g-1">
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">បុគ្គលិក</div>
						<div style="font-size: 30px;">{count_user} នាក់</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-regular fa-user fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">អតិថិជន</div>
						<div style="font-size: 30px;">{count_customer} នាក់</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-regular fa-address-card fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">ទំនិញ</div>
						<div style="font-size: 30px;">{count_product} មុខ</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-solid fa-cart-shopping fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row g-1 pt-1">
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">ចំណូល</div>
						<div style="font-size: 30px;">$ {income}</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-solid fa-chart-line fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">ចំណាយ</div>
						<div style="font-size: 30px;">$ {exspend}</div>
					</div>
					<div class="col-auto text-warning">
						<i class="fa-solid fa-chart-gantt fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-lg-4 col-md-6 col-sm-12">
			<div class="card text-bg-light">
				<div class="card-body row g-0 justify-content-between">
					<div class="col-auto">
						<div style="font-size: 30px;">
							{#if income - exspend > 0}
								ចំណេញ
							{:else}
								ខាត
							{/if}
						</div>
						<div style="font-size: 30px;">$ {income - exspend}</div>
					</div>
					<div class={income - exspend > 0 ? 'col-auto text-success' : 'col-auto text-danger'}>
						<i class="fa-solid fa-chart-pie fa-6x"></i>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div>
		<div class="py-2">
			<HeaderQuery class="row  justify-content-between g-1">
				<div class="col-auto">
					<div class="input-group">
						<span class="input-group-text">ចាប់ពី</span>
						<input type="date" name="start" class="form-control" />
					</div>
				</div>
				<div class="col-auto">
					<div class="input-group">
						<span class="input-group-text">រហូតដល់</span>
						<input type="date" name="end" class="form-control" />
					</div>
				</div>
				<div class="col-auto">
					<button
						class:active={report === 'sale'}
						type="button"
						onclick={() => (report = 'sale')}
						class="btn btn-outline-warning">របាយការណ៌លក់</button
					>
				</div>
				<div class="col-auto">
					<button
						class:active={report === 'exspend'}
						type="button"
						onclick={() => (report = 'exspend')}
						class="btn btn-outline-warning">របាយការណ៌ចំណាយ</button
					>
				</div>
				<div class="col-auto">
					<button
						class:active={report === 'out_stock'}
						type="button"
						onclick={() => (report = 'out_stock')}
						class="btn btn-outline-warning">របាយការណ៌ទំនិញអស់ស្តុក</button
					>
				</div>
				<div class="col-auto">
					<Form action="?/telegram" method="post">
						<button
							type="button"
							onclick={(e) => {
								prompt_data = prompt('ផ្ញើរបាយការណ៌ទៅTelegram?',"") ?? '';
								if(prompt_data) e.currentTarget.form?.requestSubmit()
							}}
							aria-label="telegram"
							class="btn btn-outline-warning">Telegram <i class="fa-brands fa-telegram"></i></button
						>
						<input type="hidden" value={income} name="income" />
						<input type="hidden" value={exspend} name="exspend" />
						<input type="hidden" value={prompt_data} name="prompt_data" />
						<input type="hidden" value={start} name="start" />
						<input type="hidden" value={end} name="end" />
					</Form>
				</div>
				<div class="col-auto">
					<button aria-label="print" class="btn btn-outline-warning"
						>Print <i class="fa-solid fa-print"></i></button
					>
				</div>
			</HeaderQuery>
		</div>
		{#if report === 'sale'}
			{#each get_invoices as item}
				{@const prduct_orders = item?.productOrders || []}
				<table class="table table-light table-bordered">
					<thead class="table-active">
						<tr>
							<th style="width: 200px;"
								>លេខវិក័យប័ត្រ <a
									href="/dash/pos?invoice_id={item.id}&customer_id={item.customer_id}">@{item.id}</a
								>
							</th>
							<th>អតិថិជន​ {item.customer?.name || 'ទូទៅ'}</th>
							<th style="width: 100px">ចំនួ​ន</th>
							<th style="width: 150px">តម្លៃ</th>
						</tr>
					</thead>
					<tbody>
						{#each prduct_orders || [] as product, index}
							<tr>
								<td colspan="2">{product.product.name}</td>
								<td>
									{product.quantity}
									{product.unit?.name}
								</td>
								<td>
									{#if product.type === 'set'}
										"set"
									{:else}
										$ {product.total}
									{/if}
								</td>
							</tr>
						{/each}

						<tr class="border-bottom-0">
							<td class=" border-0" colspan="2"></td>
							<td class="border border-1 border-secondary-subtle table-active">សរុប</td>
							<td class="border border-1 border-secondary-subtle table-active">$ {item.total}</td>
						</tr>
					</tbody>
				</table>
			{/each}
		{/if}
		{#if report === 'exspend'}
			{#each get_exspends as item}
				{@const inventory = item?.inventory || []}
				<table class="table table-light table-bordered">
					<thead class="table-active">
						<tr>
							<th style="width: 200px;"
								>លេខការចំណាយ <a href="/dash/exspend/create?exspend_id={item.id}">@{item.id}</a>
							</th>
							<th>អ្នកកត់ត្រា {item.user.username || ''}</th>
							<th style="width: 100px">ចំនួ​ន</th>
							<th style="width: 150px">តម្លៃ</th>
							<th style="width: 150px">សរុប</th>
						</tr>
					</thead>
					<tbody>
						{#each inventory || [] as product, index}
							<tr>
								<td colspan="2">{product.product.name}</td>
								<td>
									{product?.qty_bought}
									{product?.constUnit?.name}
								</td>
								<td>
									$ {product?.cost}
								</td>
								<td>
									$ {product?.total_expense}
								</td>
							</tr>
						{/each}
						<tr class="table-active">
							<td class="" colspan="2">
								{item?.reason}
							</td>
							<td colspan="2" class="text-end">សរុប</td>
							<td class="">$ {item.amount}</td>
						</tr>
					</tbody>
				</table>
			{/each}
		{/if}
	</div>
</div>

