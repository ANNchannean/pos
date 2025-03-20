<script lang="ts">
	import { page } from '$app/state';
	import Form from '$lib/component/Form.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import SelectParam from '$lib/component/SelectParam.svelte';
	import type { PageServerData, Snapshot } from './$types';
	import { store, type ProductOrder } from '$lib/store/store.svelte';
	import SearchProductSubmit from '$lib/component/SearchProductSubmit.svelte';
	import { addProduct, modalDiscount, calulatorDiscount } from '$lib/client/addProduct';
	import HandleQ from '$lib/component/HandleQ.svelte';
	import ListProductOrder from '$lib/component/ListProductOrder.svelte';
	let { data }: { data: PageServerData } = $props();
	let {
		get_customers,
		get_products,
		get_brands,
		get_categories,
		get_invoice,
		get_product_scan,
		get_sample_invoice
	} = $derived(data);
	let modal_type: 'pay' | 'save' = $state('pay');
	let product_id = $state(0);
	let get_product = $derived(get_products.find((e) => e.id === product_id));
	export const snapshot: Snapshot<ProductOrder[]> = {
		capture: () => store.productOrders,
		restore: (value) => (store.productOrders = value)
	};
	let innerHeight = $derived(window.innerHeight);
	let null_price = $derived(
		store.productOrders
			.filter((e) => e.type !== 'set')
			?.reduce((s, e) => s + Number(e.total || 0), 0)
			.toFixed(2)
	);
	let total_amount = $state(0);
	let set_price = $state(0);
	let plan_input_amount = $state(0);
	$effect(() => {
		total_amount = +null_price + set_price;
	});
	$effect(() => {
		if (total_amount) {
			plan_input_amount = +total_amount;
		}
	});
	let final_discount: string = $state(data.get_invoice?.discount || '');
	let final_total = $derived(
		final_discount ? calulatorDiscount(1, Number(total_amount), final_discount) : total_amount
	);
	let total_billing_amount = $derived((+final_total - plan_input_amount).toFixed(2));
	$effect(() => {
		if (page.url.searchParams.get('product_id')) {
			product_id = Number(page.url.searchParams.get('product_id'));
			if (get_product?.id !== product_id) {
				$inspect('a');
			}
		}
	});
	$effect(() => {
		if (get_invoice?.productOrders) {
			store.productOrders = get_invoice?.productOrders?.map((e) => ({
				product_id: e.product.id,
				name: e.product.name,
				price: e.price,
				qty: e.quantity,
				type: e.type,
				amount: e.amount,
				total: e.total,
				unit_id: e.unit_id,
				discount: e.discount,
				subUnit: [
					{ unit_id: e.product.unit_id, name: e.product?.unit.name, price: e.product.price },
					...e.product.subUnit.map((e) => ({
						unit_id: e.unit_id,
						name: e.unit.name,
						price: e.price
					}))
				]
			}));
		} else if (get_sample_invoice?.productOrders) {
			set_price = Number(get_sample_invoice.amount);
			store.productOrders = get_sample_invoice?.productOrders?.map((e) => ({
				product_id: e.product.id,
				name: e.product.name,
				price: e.price,
				qty: e.quantity,
				type: e.type,
				amount: e.amount,
				total: e.total,
				unit_id: e.unit_id,
				discount: e.discount,
				subUnit: [
					{ unit_id: e.product.unit_id, name: e.product?.unit.name, price: e.product.price },
					...e.product.subUnit.map((e) => ({
						unit_id: e.unit_id,
						name: e.unit.name,
						price: e.price
					}))
				]
			}));
		} else {
			store.productOrders = [];
		}
	});
	$effect(() => {
		if (get_invoice?.productOrders.some((e) => e.type !== 'set')) {
			set_price =
				get_invoice?.amount -
				get_invoice?.productOrders
					.filter((e) => e.type !== 'set')
					.reduce((s, e) => s + Number(e.total || 0), 0);
		} else {
			// return get_invoice?.amount;
			if (store.productOrders.some((e) => e.type === 'set')) {
				set_price = store.productOrders
					.filter((e) => e.type === 'set')
					.reduce((s, e) => s + Number(e.total || 0), 0);
			} else {
				set_price = 0;
			}
		}
	});
</script>

<div class="row g-1 w-100">
	<div class="col-md-5">
		<div style="height:90vh;overflow-y: scroll;" class="card rounded-0 bg-light">
			<div class="card-header">
				<div class="input-group mb-1">
					<SelectParam
						name="customer_id"
						q_name="customer_q"
						placeholder="ស្វែងរកអតិថិជន"
						items={get_customers.map((e) => ({ id: e.id, name: e.name }))}
					/>
					{#if get_invoice?.customer?.name}
						<label for="customer_id" class="input-group-text bg-warning"
							>{get_invoice?.customer?.name}</label
						>
					{/if}
				</div>
				<SearchProductSubmit
					name="product_id"
					q_name="product_q"
					placeholder="ស្វែងរកផលិតផល ឫស្កែនបាកូដ"
					items={get_product_scan.map((e) => ({ id: e.id, name: e.name, price: e.price }))}
				/>
			</div>
			<div class="card-body table-responsive p-0">
				<table class="table table-sm">
					<thead class="table-active table-bordered">
						<tr>
							<td style="width: 40%;">ផលិតផល់</td>
							<td style="width: 20$;">តម្លៃ</td>
							<td style="width: 10$;">ចំនួន</td>
							<td style="width: 20$;">សរុប</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{#if store.productOrders?.some((e) => e.type === 'set')}
							<tr>
								<td colspan="2">
									<button class="text-end float-end btn btn-success"> កញ្ចប់តម្លៃ </button>
								</td>
								<td colspan="3">
									<input
										bind:value={set_price}
										class="form-control"
										type="number"
										name="set_price"
										id="set_price"
									/>
								</td>
							</tr>
						{/if}
						{#each store.productOrders as product_order}
							<ListProductOrder get_product={product_order} product_id={product_order.product_id} />
						{/each}
					</tbody>
				</table>
			</div>
			<div class="card-footer">
				<fieldset disabled={!store.productOrders.length}>
					<div class=" border-0 bg-primary-subtle mb-1 w-100">
						<div class="row">
							<div class="col text-start mx-2">សរុបទំនិញ</div>
							<div class="col text-end mx-2">{store.productOrders.length} មុខ</div>
						</div>
					</div>
					<div class=" border-0 bg-primary-subtle mb-2 w-100">
						<div class="row">
							<div class="col text-start mx-2">សរុបតម្លៃ</div>
							<div class="col text-end mx-2">
								$ {total_amount}
							</div>
						</div>
					</div>

					<div class="row g-2">
						<div class="col-md-4">
							<a
								href="?"
								onclick={() =>
									confirm('ទំនិញនឹងត្រូវសំអាតទាំងអស់') ? (store.productOrders = []) : undefined}
								class="border-0 py-2 btn-lg rounded-0 btn btn-danger w-100"
								><i class="fa-solid fa-ban"></i> បោះបង់</a
							>
						</div>
						<div class="col-md-4">
							<button
								onclick={() => (modal_type = 'save')}
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#billingModal"
								class="border-0 btn-lg py-2 rounded-0 btn btn-success w-100"
								><i class="fa-solid fa-file-export"></i> រក្សាទុក</button
							>
						</div>

						<div class="col-md-4">
							<button
								onclick={() => (modal_type = 'pay')}
								type="button"
								data-bs-toggle="modal"
								data-bs-target="#billingModal"
								class="border-0 btn-lg py-2 rounded-0 btn btn-primary w-100"
								><i class="fa-solid fa-comments-dollar"></i> ទូទាត់ប្រាក់</button
							>
						</div>
					</div>
				</fieldset>
			</div>
		</div>
	</div>
	<div class="col-md-7">
		<div class="card rounded-0">
			<div class="card-header">
				<HeaderQuery>
					<div class="row">
						<div class="col-4">
							<SelectParam name="brand_id" placeholder="ប្រេនទំនិញ" items={get_brands} />
						</div>
						<div class="col-4">
							<SelectParam name="category_id" placeholder="ប្រភេទទំនិញ" items={get_categories} />
						</div>
						<div class="col-4">
							<HandleQ q_name="search" />
						</div>
					</div>
				</HeaderQuery>
			</div>
			<div style="height: {innerHeight - 148}px; " class="card-body overflow-scroll">
				<div class="row">
					{#each get_products as product}
						{@const subUnit = [
							{ unit_id: product.unit_id, name: product.unit.name, price: product.price },
							...product.subUnit.map((e) => ({
								unit_id: e.unit_id,
								name: e.unit.name,
								price: e.price
							}))
						]}

						<div class="col-md-3 col-lg-3 mb-4 col-sm-4">
							<div class="card">
								<img
									src={product?.image ? `/uploads/${product?.image}` : `/no-image.png`}
									class="card-img-top"
									alt=""
								/>
								<div class="card-body">
									<!-- <h5 class="card-title">Card title</h5> -->
									<p class="card-text text-truncate">
										{product.name}
									</p>
									<button
										type="button"
										onclick={() =>
											addProduct({
												product_id: product.id,
												name: product.name,
												price: product.price,
												qty: 1,
												type: null,
												total: product.price,
												amount: product.price,
												discount: null,
												unit_id: product.unit_id,
												subUnit: subUnit
											})}
										class="btn btn-warning w-100">តម្លៃ $ {product.price}</button
									>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal Billing -->
<div
	class="modal fade"
	id="billingModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<div class="modal-title">
					<h1 class="my-0 py-0 text-truncate text-warning">
						<i class="fa-solid fa-receipt"></i> ពត៌មានការទូទាត់ប្រាក់
					</h1>
				</div>
				<button
					id="close_modal_billing"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				></button>
			</div>
			<Form
				showToast={false}
				fnSuccess={() => {
					store.productOrders = [];
					document.getElementById('close_modal_billing')?.click();
				}}
				action="?/pos"
				method="post"
			>
				<input type="hidden" name="return_or_balance" value={total_billing_amount} />
				<input type="hidden" name="invoice_id" value={page.url.searchParams.get('invoice_id')} />
				<input type="hidden" name="customer_id" value={page.url.searchParams.get('customer_id')} />
				{#if modal_type === 'save'}
					<input type="hidden" name="save" value="pending" />
				{/if}
				<input type="hidden" name="final_total" value={final_total} />
				{#each store.productOrders as item (item.product_id)}
					<input type="hidden" name="product_id" value={item.product_id} />
					<input type="hidden" name="type" value={item.type} />
					<input type="hidden" name="discount" value={item.discount} />
					<input type="hidden" name="qty" value={item.qty} />
					<input type="hidden" name="price" value={item.price} />
					<input type="hidden" name="total" value={item.total} />
					<input type="hidden" name="unit_id" value={item.unit_id} />
					<input type="hidden" name="amount" value={item.amount} />
				{/each}
				<div class="modal-body">
					<div>
						<table class="table table-primary">
							<tbody>
								<tr>
									<td>ឈ្មោះអតិថិជន</td>
									<td>:</td>
									<td> General </td>
								</tr>
								<tr>
									<td>សរុបទំនិញ</td>
									<td>:</td>
									<td>
										{store.productOrders.length} មុខ
									</td>
								</tr>
								<tr>
									<td>សរុបតម្លៃ</td>
									<td>:</td>
									<td>
										$ {total_amount}
									</td>
								</tr>
								<tr>
									<td>បញ្ជុះតម្លៃ</td>
									<td>:</td>
									<td>
										{final_discount} សរុបចុងក្រោយ​ $ {final_total}
									</td>
								</tr>
								<tr>
									<td>ប្រាក់អាប់ឫជំពាក់</td>
									<td>:</td>
									<td>
										{#if +total_billing_amount < 0}
											<span class="text-success">
												"ប្រាក់អាប់" $ {total_billing_amount.toString().replace('-', '')}
											</span>
										{/if}
										{#if +total_billing_amount > 0}
											<span class="text-danger">
												"ប្រាក់ជំពាក់" $ {total_billing_amount}
											</span>
										{/if}
										{#if +total_billing_amount === 0}
											<span class="text-primary"> "គ្មានប្រាក់អាប់ឫជំពាក់" </span>
										{/if}
										<!-- {plan_input_amount} -->
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="input-group pb-2">
						<label style="width: 100px;" for="total_amount" class="input-group-text"
							>ប្រាក់សរុប</label
						>
						<input
							class="form-control"
							bind:value={total_amount}
							type="number"
							step="any"
							name="total_amount"
							id="total_amount"
						/>
						<label for="total_amount" class="input-group-text">$</label>
					</div>
					<div class="input-group pb-2">
						<label style="width: 100px;" for="total_amount" class="input-group-text"
							>បញ្ជុះតម្លៃ</label
						>
						<input
							oninput={(e) => {
								const value = e.currentTarget.value || '';
								if (!isNaN(+value)) {
								} else {
									if (!value.includes('%')) {
										e.currentTarget.value = value.slice(0, value.length - 1);
										alert('ទិន្ន័យត្រូវតែជាលេខឫមានសញ្ញា % នៅខាងក្រោយ');
									}
								}
							}}
							bind:value={final_discount}
							class="form-control"
							type="text"
							name="final_discount"
							id="final_discount"
						/>
						<label for="final_discount" class="input-group-text">$</label>
					</div>
					<div class="input-group pb-2">
						<label style="width: 100px;" for="total_amount" class="input-group-text"
							>ប្រាក់ទទួល</label
						>
						<input
							oninput={(e) => (plan_input_amount = +e.currentTarget.value)}
							class="form-control"
							value={final_total}
							type="number"
							step="any"
							name="get_amount"
							id="get_amount"
						/>
						<label for="get_amount" class="input-group-text">$</label>
					</div>
					<div>
						<textarea
							value={get_invoice?.note}
							placeholder="ចំណាំលើការទូទាត់ប្រាក់"
							class="form-control"
							name="billing_note"
							id="billing_note"
						></textarea>
					</div>
				</div>

				<div class="modal-footer">
					<button disabled={!store.productOrders.length} type="submit" class="btn btn-warning">
						{#if modal_type === 'pay'}
							<i class="fa-solid fa-comments-dollar"></i> ទូទាត់ប្រាក់
						{:else}
							<i class="fa-solid fa-file-export"></i> រក្សាទុក្ខ
						{/if}
					</button>
				</div>
			</Form>
		</div>
	</div>
</div>
