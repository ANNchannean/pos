<script lang="ts">
	import AlertDelete from '$lib/component/AlertDelete.svelte';
	import CropImage from '$lib/component/CropImage.svelte';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_product, get_units } = $derived(data);
</script>

<h4>បញ្ជូលខ្នាតលក់ដុំ</h4>
<hr />
<div>
	<div class="row">
		<div class="col-auto">
			<img class="img-thumbnail" style="height: 90px;" src="/uploads/{get_product?.image}" alt="" />
		</div>
		<div class="col">
			<div>
				ឈ្មេះផលិតផល​​ : {get_product?.name}
			</div>
			<div>
				ខ្នាតលក់រាយ : {get_product?.unit?.name}
			</div>
			<div>
				<span>ខ្នាតលក់ដុំ</span>
				<br />
				{#each get_product?.subUnit || [] as unit}
					<Form action="?/delete_sub_unit" method="post">
						<span>
							1 {unit.unit.name} មាន {unit.qty_per_unit}
							{get_product?.unit.name}
						</span>
						<span>
							<input type="hidden" name="sub_unit_id" value={unit.id} />
							<button
								type="button"
								onclick={(e) =>
									confirm('ទិន្ន័យនឹងត្រូវលុបជារៀងរហូត!')
										? e.currentTarget.form?.requestSubmit()
										: undefined}
								class="btn btn-link text-decoration-none text-danger">លុបខ្នាតដុំ</button
							>
						</span><br />
					</Form>
				{/each}
			</div>
		</div>
	</div>
</div>
<Form action="?/add_sub_unit" method="post">
	<div class="pb-2">
		<label for="">ខ្នាត</label>
		<input type="hidden" name="product_id" value={get_product?.id} />
		<select class="form-control" name="unit_id" id="">
			<option value="">សូមជ្រើសទិន្ន័យ</option>
			{#each get_units as item}
				<option value={item.id}>{item?.name}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="">ចំនួនគិតជា {get_product?.unit.name} </label>
		<input name="qty_per_unit" type="number" class="form-control" />
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
