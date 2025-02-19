<script lang="ts">
	import { enhance } from '$app/forms';
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_customers } = $derived(data);
	let q = $state('');
	let q_customers = $derived(
		get_customers.filter((e) => e.name?.toLowerCase().includes(q.toLowerCase()))
	);
</script>

<div class="row">
	<div class="col-md-4">
		<div style="height:90vh;overflow-y: scroll;" class="card bg-light">
			<div class="card-header">
				<div class="input-group mb-1">
					<select class="form-select" name="customer_id" id="customer_id">
						<option value="">ទូទៅ</option>
						{#each get_customers as customer}
							<option value={customer.id}>{customer.name}</option>
						{/each}
					</select>
					<label for="customer_id" class="input-group-text">+</label>
				</div>
				<input
					placeholder="ស្វែងរកផលិតផល ស្កែនបាកូដ"
					type="search"
					class="form-control"
					name="q_product"
					id=""
				/>
			</div>
			<div class="card-body table-responsive p-0 m-0">
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
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
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
						<div class="col text-end mx-2">12$</div>
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
	<div class="col-md-8">2</div>
</div>
