<script lang="ts">
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import HandleQ from '$lib/component/HandleQ.svelte';
	import HeaderQuery from '$lib/component/HeaderQuery.svelte';
	import NoData from '$lib/component/NoData.svelte';
	import Paginations from '$lib/component/Paginations.svelte';
	import SelectParam from '$lib/component/SelectParam.svelte';
	import { store } from '$lib/store/store.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let { get_products, get_brands, get_categories } = $derived(data);
	let n = $state(1);
</script>

<h4>បញ្ជីផលិតផល</h4>
<hr />
<div class="row pb-1">
	<div class="col-auto">
		<Paginations items={100} bind:n />
	</div>

	<div class="col-auto">
		<HeaderQuery>
			<!-- <div class="col-auto">
				<button type="reset" class="btn btn-warning">សំអាត</button>
			</div> -->
			<div class="col-auto">
				<HandleQ q_name="q" />
			</div>
			<div style="width: 300px;" class="col-auto">
				<SelectParam placeholder="ស្វែងរកតាមប្រេនទំនិញ" name="brand_id" items={get_brands} />
			</div>
			<div style="width: 300px;" class="col-auto">
				<SelectParam
					placeholder="ស្វែងរកតាមប្រភេទទំនិញ"
					name="category_id"
					items={get_categories}
				/>
			</div>
			<div class="col-auto">
				<a href="/dash/product/create" class="btn btn-warning">បង្កើតថ្មី</a>
			</div>
		</HeaderQuery>
	</div>
</div>
<div style="height: {store.inerHight};" class="table-responsive overflow-x-hidden">
	<table class="table table-light">
		<thead style="z-index: 1;" class="sticky-top position-sticky table-active">
			<tr>
				<th scope="col">#</th>
				<th scope="col">រូបភាព</th>
				<th scope="col">ឈ្មោះទំនិញ</th>
				<th scope="col">បាកូដ</th>
				<th scope="col">តម្លៃ</th>
				<th scope="col">ចំនួនមាន</th>
				<th scope="col">ខ្នាតដុំ</th>
				<th scope="col">ប្រភេទទំនិញ</th>
				<th colspan="2" scope="col">ប្រេនទំនិញ</th>
			</tr>
		</thead>
		<tbody>
			{#each get_products as item, index}
				{@const qty_avallable = item.inventory.reduce((s, e) => s + Number(e.qty_available), 0)}
				<tr>
					<td>{n + index}</td>
					<td>
						<img
							class="img-thumbnail"
							style="height: 50px;"
							src={item.image ? `/uploads/${item.image}` : `/no-image.png`}
							alt=""
						/>
					</td>
					<td>
						<div class="text-truncate" style="width: 20rem;">
							<a class="text-decoration-none" href="/dash/product/history?product_id={item.id}">
								{item.name} <br />
							</a>
						</div>
					</td>
					<td>
						<div style="width: 10rem;" class="text-truncate">
							{item.barcode}
						</div>
					</td>
					<td>$ {item.price}</td>
					<td>
						<div>
							{qty_avallable}
							{item.unit.name}
						</div>
					</td>
					<td>
						<div>
							<a class="text-decoration-none" href="/dash/product/sub-unit?product_id={item.id}">
								{#each item.subUnit || [] as sub_unit}
									{(qty_avallable / sub_unit.qty_per_unit).toFixed()} {sub_unit.unit.name} <br />
								{/each}
								{#if !item.subUnit.length}
									...
								{/if}
							</a>
						</div>
					</td>
					<td>
						<div class="text-truncate" style="width: 10rem;">
							{item?.category?.name}
						</div>
					</td>
					<td>
						<div class="text-truncate" style="width: 10rem;">
							{item.brand?.name}
						</div>
					</td>
					<td>
						<div class="row g-1">
							<div class="col-auto">
								<AlertDelete action="?/delete">
									<input type="hidden" name="product_id" value={item.id} />
								</AlertDelete>
							</div>
							<div class="col">
								<a class="btn btn-outline-warning" href="/dash/product/create?product_id={item.id}"
									><i class="fa-solid fa-edit"></i> កែសម្រួល</a
								>
							</div>
						</div>
					</td>
				</tr>
			{/each}
			<NoData colspan={9} items={get_products.length} />
		</tbody>
	</table>
</div>
