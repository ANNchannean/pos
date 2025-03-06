<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import Form from '$lib/component/Form.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import Select from '$lib/component/Select.svelte';
	import SelectParam from '$lib/component/SelectParam.svelte';
	import type { PageServerData, Snapshot } from './$types';
	interface TForm {
		id: number;
		name: string;
		price: number;
		qty: number;
		amount: number;
		total: number;
		unit_id: number;
		discount: string | null;
	}
	let { data }: { data: PageServerData } = $props();
	let { get_customers, get_products, get_brands, get_categories } = $derived(data);
	let q = $state('');
	let q_customers = $derived(
		get_customers.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
	let product_order_id = $state(0);

	let product_order: TForm[] = $state([]);
	export const snapshot: Snapshot<TForm[]> = {
		capture: () => product_order,
		restore: (value) => (product_order = value)
	};
	function addProduct(para: TForm) {
		// ប្រសិនបើមានទំនិញបានបញ្ជូលរូចត្រូវបូកបន្ថែម ១
		if (product_order.some((e) => e.id === para.id)) {
			// Function ស្វែងរកទំនិញដែលមានហើយបូក ១បន្ថែម
			let obj = product_order.find((obj) => obj.id === para.id);
			if (obj) {
				obj.qty = obj.qty + 1;
				obj.amount = +(obj.qty * obj.price).toFixed();
				obj.total = obj.discount
					? +Number(calulatorDiscount(obj.qty, obj.price, obj.discount)).toFixed(2)
					: obj.amount;
			}
			// modify ទិន្ន័យ product_order
			//​ បើសិនរកមិនឃើញបញ្ជូលទំនិញ ទៅ product_order
		} else {
			product_order.push(para);
		}
	}
	let innerHeight = $derived(window.innerHeight);
	function modalDiscount(product_order_id: number) {
		const discount = (document.getElementById(`discount${product_order_id}`) as HTMLInputElement)
			?.value;
		const price = (document.getElementById(`price${product_order_id}`) as HTMLInputElement)?.value;
		const qty = (document.getElementById(`qty${product_order_id}`) as HTMLInputElement)?.value;
		const found = product_order.find((e) => e.id === product_order_id);
		if (found) {
			found.qty = Number(qty);
			found.amount = +(+qty * +price).toFixed(2);
			found.discount = discount;
			found.price = +Number(price).toFixed(2);
			found.total = discount
				? +Number(calulatorDiscount(+qty, +price, discount)).toFixed(2)
				: +found.amount.toFixed(2);
		}
		document.getElementById('close_modal')?.click();
	}
	function calulatorDiscount(qty: number, price: number, discount: string) {
		if (!qty || !price || !discount) return 0;
		const total = qty * price;
		if (discount.includes('%')) {
			return (total - +(total * (Number(discount.replace('%', '')) / 100))).toFixed(2);
		} else {
			return +(qty * price - Number(discount) * qty).toFixed(2);
		}
	}
	let total_amount = $derived(
		product_order.reduce((s, e) => s + Number(e.total || 0), 0).toFixed(2)
	);
	let plan_input_amount = $state(0);
	$effect(() => {
		if (total_amount) {
			plan_input_amount = +total_amount;
		}
	});
	let total_billing_amount = $derived((+total_amount - plan_input_amount).toFixed(2));
</script>

<div class="row g-1 w-100">
	<div class="col-md-5">
		<div style="height:90vh;overflow-y: scroll;" class="card rounded-0 bg-light">
			<div class="card-header">
				<div class="input-group mb-1">
					<Select
						name="customer_id"
						displayName="ស្វែងរកអតិថិជន"
						items={get_customers.map((e) => ({ id: e.id, name: e.name }))}
					/>
				</div>

				<Select
					name="product_id"
					displayName="ស្វែងរកផលិតផល ឫស្កែនបាកូដ"
					items={get_products.map((e) => ({ id: e.id, name: e.name }))}
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
						{#each product_order as form (form.id)}
							<tr>
								<td>
									<div>
										<!-- Button trigger modal -->
										<button
											onclick={() => {
												product_order_id = form.id;
											}}
											type="button"
											class="btn btn-link my-0 py-0 text-start text-decoration-none"
											data-bs-toggle="modal"
											data-bs-target="#discountModal"
										>
											{form.name}
										</button>
									</div>
								</td>
								<td>$ {form.price} </td>
								<td>
									<input
										onchange={(e) => {
											const value = +e.currentTarget.value as number;
											const found = product_order.find((e) => e.id === form.id);
											if (found) {
												found.qty = Number(value);
												found.amount = +(+value * form.price);
												found.total = found.discount
													? +Number(
															calulatorDiscount(found.qty, found.price, found.discount)
														).toFixed(2)
													: found.amount;
											}
										}}
										class="form-control py-1"
										style="width: 60px;"
										type="number"
										min="1"
										value={form.qty}
									/>
								</td>
								<td>$ {form.total}</td>
								<td>
									<button
										onclick={() => {
											product_order = product_order.filter((e) => e.id !== form.id);
										}}
										aria-label="delete"
										class="btn btn-link text-decoration-none text-danger"
									>
										<i class="fa-solid fa-trash"></i>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="card-footer">
				<div class=" border-0 bg-primary-subtle mb-1 w-100">
					<div class="row">
						<div class="col text-start mx-2">សរុបទំនិញ</div>
						<div class="col text-end mx-2">{product_order.length} មុខ</div>
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
						<button class="border-0 py-2 text-bg-warning h-50 w-100">រក្សាទុក</button>
						<button
							onclick={() =>
								confirm('ទំនិញនឹងត្រូវសំអាតទាំងអស់') ? (product_order = []) : undefined}
							class="border-0 py-2 text-bg-danger h-50 w-100">បោះបង់</button
						>
					</div>
					<div class="col-md-4">
						<button class="border-0 py-2 text-bg-success h-50 w-100">បោះពុម្ភការកុម្មង់</button>
						<button class="border-0 py-2 text-bg-info h-50 w-100">បោះពុម្ភវិក្កយបត្រ</button>
					</div>

					<div class="col-md-4">
						<button
							data-bs-toggle="modal"
							data-bs-target="#billingModal"
							class="border-0 py-2 text-bg-primary w-100 h-100">ទូទាត់ប្រាក់</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-7">
		<div class="card rounded-0">
			<div class="card-header">
				<HeaderQuery>
					<div class="row">
						<div class="col-6">
							<SelectParam name="brand_id" placeholder="ប្រេនទំនិញ" items={get_brands} />
						</div>
						<div class="col-6">
							<SelectParam name="category_id" placeholder="ប្រភេទទំនិញ" items={get_categories} />
						</div>
					</div>
				</HeaderQuery>
			</div>
			<div style="height: {innerHeight - 148}px; " class="card-body overflow-scroll">
				<div class="row">
					{#each get_products as product}
						<div class="col-md-3 col-lg-2 mb-4 col-sm-4">
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
												id: product.id,
												name: product.name,
												price: product.price,
												qty: 1,
												total: product.price,
												amount: product.price,
												discount: null,
												unit_id: product.unit_id
											})}
										class="btn btn-primary w-100">តម្លៃ $ {product.price}</button
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

<!-- Modal Discount -->
<div
	class="modal fade"
	id="discountModal"
	tabindex="-1"
	aria-labelledby="exampleModalLabel"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5 text-truncate" id="exampleModalLabel">
					{product_order.find((e) => e.id === product_order_id)?.name}
				</h1>
				<button
					id="close_modal"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				></button>
			</div>
			<div class="modal-body">
				<div class="input-group pb-2">
					<label style="width: 120px;" for="" class="input-group-text">បញ្ចុះតម្លៃ</label>
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
						value={product_order.find((e) => e.id === product_order_id)?.discount}
						type="text"
						name="discount"
						class="form-control"
						id={`discount${product_order_id}`}
					/>
				</div>
				<div class="input-group pb-2">
					<label style="width: 120px;" for="" class="input-group-text">ខ្នាត</label>
					<input
						value={product_order.find((e) => e.id === product_order_id)?.qty}
						type="number"
						name="qty"
						step="0.25"
						min="1"
						class="form-control"
						id={`qty${product_order_id}`}
					/>
				</div>
				<div class="input-group">
					<label style="width: 120px;" for="" class="input-group-text">តម្លៃលក់</label>
					<input
						value={product_order.find((e) => e.id === product_order_id)?.price}
						type="number"
						name="price"
						step="0.25"
						min="1"
						class="form-control"
						id={`price${product_order_id}`}
					/>
				</div>
			</div>
			<div class="modal-footer float-end">
				<button
					onclick={() => {
						modalDiscount(product_order_id);
					}}
					type="button"
					class="btn btn-primary">រក្សាទុក</button
				>
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
					<h1 class="my-0 py-0 text-truncate text-warning"><i class="fa-solid fa-receipt"></i> ពត៌មានការទូទាត់ប្រាក់</h1>
				</div>
				<button
					id="close_modal_billing"
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
				></button>
			</div>
			<Form fnSuccess={() => {
				document.getElementById('close_modal_billing')?.click()
				product_order = []
			} } action="?/pos" method="post">
				<input type="hidden" name="return_or_balance" value={total_billing_amount} />
				{#each product_order as item (item.id)}
					<input type="hidden" name="product_id" value={item.id} />
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
										{product_order.length} មុខ
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
						<label for="total_amount" class="input-group-text">សរុបតម្លៃ</label>
						<input
							oninput={(e) => (plan_input_amount = +e.currentTarget.value)}
							class="form-control"
							value={total_amount}
							type="number"
							step="any"
							name="total_amount"
							id="total_amount"
						/>
						<label for="total_amount" class="input-group-text">$</label>
					</div>
					<div>
						<textarea
							placeholder="ចំណាំលើការទូទាត់ប្រាក់"
							class="form-control"
							name="billing_note"
							id="billing_note"
						></textarea>
					</div>
				</div>

				<div class="modal-footer">
					<button disabled={!product_order.length} type="submit" class="btn btn-warning"
						><i class="fa-solid fa-comments-dollar"></i> គិតប្រាក់</button
					>
				</div>
			</Form>
		</div>
	</div>
</div>
