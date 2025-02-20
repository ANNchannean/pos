<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import Select from '$lib/component/Select.svelte';
	import type { PageServerData, Snapshot } from './$types';
	interface TForm {
		id: number;
		name: string;
		price: number;
		qty: number;
		total: number;
		unit: number;
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
</script>

<div style="margin-top: 59px;z-index: -1;" class="row fixed-top position-absolute g-0">
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
			<div class="card-body table-responsive">
				<table class="table table-light table-active table-sm">
					<thead>
						<tr>
							<td>ផលិតផល់</td>
							<td>តម្លៃ</td>
							<td>ចំនួន</td>
							<td>សរុប</td>
						</tr>
					</thead>
					<tbody>
						{#each form_pos as form}
							<tr>
								<td>{form.name}</td>
								<td>{form.price}</td>
								<td>{form.qty}</td>
								<td>{form.total}</td>
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
						<div class="col text-end mx-2">
							$ {total}
						</div>
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
							<Select
								name="brand_id"
								selectType="param"
								displayName="ប្រេនទំនិញ"
								items={get_brands}
							/>
						</div>
						<div class="col-6">
							<Select
								name="category_id"
								selectType="param"
								displayName="ប្រភេទទំនិញ"
								items={get_categories}
							/>
						</div>
					</div>
				</HeaderQuery>
			</div>
			<div class="card-body">
				{#each get_products as product}
					<div class="card" style="width: 10rem;">
						<img src="/uploads/{product.image}" class="card-img-top" alt="" />
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
										unit: product.unit_id
									})}
								class="btn btn-primary w-100">តម្លៃ $ {product.price}</button
							>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
