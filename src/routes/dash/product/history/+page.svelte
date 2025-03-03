<script lang="ts">
	import Barcode from '$lib/component/Barcode.svelte';
	import DatetimeFormat from '$lib/component/DatetimeFormat.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product } = $derived(data);
</script>

<h4>ប្រវត្តិការទិញទំនិញ</h4>
<hr />
<div class="pb-3">
	<div class="row">
		<div class="col-auto">
			<img
				class="img-thumbnail"
				style="height: 370px;"
				src="/uploads/{get_product?.image}"
				alt=""
			/> <br />
		</div>
		<div class="col">
			<table class="table">
				<tbody>
					<tr>
						<td>ឈ្មេះផលិតផល​​</td>
						<td>:</td>
						<td>
							<a href="/dash/product/create?product_id={get_product?.id}">{get_product?.name}</a>
						</td>
					</tr>
					<tr>
						<td>ប្រេនទំនិញ</td>
						<td>:</td>
						<td>{get_product?.brand?.name}</td>
					</tr>
					<tr>
						<td>ប្រភេទទំនិញ</td>
						<td>:</td>
						<td>{get_product?.category?.name}</td>
					</tr>
					<tr>
						<td>ម៉ូដែល</td>
						<td>:</td>
						<td>{get_product?.model}</td>
					</tr>
					<tr>
						<td>ល័ក្ខណ </td>
						<td>:</td>
						<td>{get_product?.condition}</td>
					</tr>
					<tr>
						<td>បាកូដ </td>
						<td>:</td>
						<td>
							<Barcode text={get_product?.barcode || ''} />
						</td>
					</tr>
					<tr>
						<td>ការពិពណ៌នា </td>
						<td>:</td>
						<td>
							<div class="text-break">
								{get_product?.description}
							</div>
						</td>
					</tr>
					<tr>
						<td>ខ្នាតលក់រាយ</td>
						<td>:</td>
						<td>{get_product?.unit?.name}</td>
					</tr>
					<tr>
						<td>ខ្នាតលក់ដុំ</td>
						<td>:</td>
						<td>
							<div>
								{#each get_product?.subUnit || [] as unit}
									<span>
										@1 {unit.unit.name} មាន {unit.qty_per_unit}
										{get_product?.unit.name} &nbsp;
									</span>
								{/each}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<div>
	<table class="table table-warning">
		<thead>
			<tr>
				<td>លរ</td>
				<td>កាលបរិច្ឋេទទិញ</td>
				<td>ចំនួនទិញចូល</td>
				<td>តម្លៃទិញចូល</td>
				<td>សរុបចំណាយ</td>
			</tr>
		</thead>
		<tbody>
			{#each get_product?.inventory || [] as inventory, index}
				<tr>
					<td>{index + 1}</td>
					<td> <DatetimeFormat date={inventory.datetime_buy} /> </td>
					<td>
						{inventory.qty_bought}
						{inventory.constUnit?.name}
					</td>
					<td>
						{inventory.cost} $ / {inventory.constUnit?.name}
					</td>
					<td>
						{inventory.total_expense} $
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
