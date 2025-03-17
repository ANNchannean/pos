<script lang="ts">
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import CropImage from '$lib/component/CropImage.svelte';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_units, get_sub_unit } = $derived(data);
</script>

<h4>បញ្ជូលខ្នាតលក់ដុំ</h4>
<hr />
<div class="pb-3">
	<div class="row">
		<div class="col-auto">

			<img
			class="img-thumbnail"
			style="height: 200px;"
			src={get_product?.image ? `/uploads/${get_product.image}` : `/no-image.png`}
			alt=""
		/>
		</div>
		<div class="col">
			<table class="table table-light">
				<tbody>
					<tr>
						<td>ឈ្មេះផលិតផល​​</td>
						<td>:</td>
						<td>{get_product?.name}</td>
					</tr>
					<tr>
						<td>ខ្នាតលក់រាយ</td>
						<td>:</td>
						<td>{get_product?.unit?.name} / $ {get_product?.price}</td>
					</tr>
					<tr>
						<td>ខ្នាតលក់ដុំ</td>
						<td>:</td>
						<td>
							<div>
								{#each get_product?.subUnit || [] as sub_unit, index}
									<div class="row">
										<div class="col-auto">
											<a
												href="/dash/product/sub-unit?product_id={sub_unit.product_id}&sub_unit_id={sub_unit.id}"
												class="btn btn-link"
											>
												@ 1 {sub_unit.unit.name} មាន {sub_unit.qty_per_unit}
												{get_product?.unit.name} តម្លៃ $ {sub_unit.price}
											</a>
										</div>
										<div class="col">
											<AlertDelete
												class="btn btn-link text-decoration-none text-danger"
												name="លុបខ្នាតដុំ"
												action="?/delete_sub_unit"
											>
												<input type="hidden" name="sub_unit_id" value={sub_unit.id} />
											</AlertDelete>
										</div>
									</div>
								{/each}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<Form action="?/add_sub_unit" method="post">
	<div class="pb-2">
		<label for="">ខ្នាត</label>
		<input type="hidden" name="product_id" value={get_product?.id} />
		<input type="hidden" name="sub_unit_id" value={get_sub_unit?.id} />
		<!-- svelte-ignore a11y_autofocus -->
		<select autofocus class="form-control" name="unit_id" id="">
			<option value="">សូមជ្រើសទិន្ន័យ</option>
			{#each get_units as item}
				<option selected={item.id === get_sub_unit?.unit_id} value={item.id}>{item?.name}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="">ចំនួនគិតជា {get_product?.unit.name} </label>
		<input
			value={get_sub_unit?.qty_per_unit}
			placeholder="ខ្លាតពីតូចទៅធំ​"
			name="qty_per_unit"
			type="number"
			class="form-control"
		/>
	</div>
	<div class="mb-2">
		<label for="">តម្លៃលក់ដុំ</label>
		<input
			value={get_sub_unit?.price}
			placeholder=""
			name="price"
			step="any"
			type="number"
			class="form-control"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
