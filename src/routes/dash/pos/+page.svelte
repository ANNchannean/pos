<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
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
		total: number;
		unit_id: number;
		dis_value: string | null;
		dis_pecent: number | null;
	}
	let { data }: { data: PageServerData } = $props();
	let { get_customers, get_products, get_brands, get_categories } = $derived(data);
	let q = $state('');
	let q_customers = $derived(
		get_customers.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
	let form_pos: TForm[] = $state([]);
	export const snapshot: Snapshot<TForm[]> = {
		capture: () => form_pos,
		restore: (value) => (form_pos = value)
	};
	function alertDiscount() {
		let value = prompt('Please enter your name', '');
		let ps = prompt('Please enter your name', '');
		let person = prompt('Please enter your name', '');
	}
	function addProduct(para: TForm) {
		// ប្រសិនបើមានទំនិញបានបញ្ជូលរូចត្រូវបូកបន្ថែម ១
		if (form_pos.some((e) => e.id === para.id)) {
			// Function ស្វែងរកទំនិញដែលមានហើយបូក ១បន្ថែម
			let obj = form_pos.find((obj) => obj.id === para.id);
			if (obj) {
				obj.qty = obj.qty + 1;
				obj.total = +((obj.qty + 1) * obj.price).toFixed(2);
			}
			// modify ទិន្ន័យ form_pos
			//​ បើសិនរកមិនឃើញបញ្ជូលទំនិញ ទៅ form_pos
			return;
		}
		form_pos.push(para);
	}
	let total = $derived(form_pos?.reduce((s, e) => s + +e.total, 0).toFixed(2));
	let innerHeight = $derived(window.innerHeight);
</script>

<div class="row g-1 w-100">
	<div class="col-md-4">
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
							<td style="width: 50%;">ផលិតផល់</td>
							<td style="width: 20$;">តម្លៃ</td>
							<td style="width: 10$;">ចំនួន</td>
							<td style="width: 20$;">សរុប</td>
						</tr>
					</thead>
					<tbody>
						{#each form_pos as form}
							<tr>
								<td>
									<div>
										<button
											onclick={alertDiscount}
											class="btn btn-link text-start text-decoration-none"
										>
											{form.name}
										</button>
									</div>
								</td>
								<td>$ {form.price} </td>
								<td>
									<input
										onchange={(e) => {
											addProduct({
												id: form.id,
												name: form.name,
												price: form.price,
												qty: Number(e.currentTarget.value),
												total: form.price,
												dis_value: null,
												dis_pecent: null,
												unit_id: form.unit_id
											});
										}}
										class="form-control py-1"
										style="width: 60px;"
										type="number"
										value={form.qty}
									/>
								</td>
								<td>$ {form.total}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="card-footer">
				<div class=" border-0 bg-primary-subtle mb-1 w-100">
					<div class="row">
						<div class="col text-start mx-2">បញ្ចុះតម្លៃ</div>
						<div class="col text-end mx-2">12$</div>
					</div>
				</div>
				<div class=" border-0 bg-primary-subtle mb-2 w-100">
					<div class="row">
						<div class="col text-start mx-2">សរុប</div>
						<div class="col text-end mx-2">$ 1</div>
					</div>
				</div>

				<div class="row g-2">
					<div class="col-md-4">
						<button class="border-0 py-2 text-bg-warning h-50 w-100">រក្សាទុក</button>
						<button class="border-0 py-2 text-bg-danger h-50 w-100">បោះបង់</button>
					</div>
					<div class="col-md-4">
						<button class="border-0 py-2 text-bg-success h-50 w-100">បោះពុម្ភការកុម្មង់</button>
						<button class="border-0 py-2 text-bg-info h-50 w-100">បោះពុម្ភវិក្កយបត្រ</button>
					</div>

					<div class="col-md-4">
						<button class="border-0 py-2 text-bg-primary w-100 h-100">ទូទាត់ប្រាក់</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-8">
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
												dis_value: null,
												dis_pecent: null,
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
