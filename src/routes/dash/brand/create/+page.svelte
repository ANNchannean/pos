<script lang="ts">
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, ActionData } from './$types';
	import type { Snapshot } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_brand } = $derived(data);
	let brand_name = $state(data?.get_brand?.name ?? '');
	export const snapshot: Snapshot<string> = {
		capture: () => brand_name,
		restore: (value) => (brand_name = value)
	};
</script>

<h4>បង្កើតប្រេនថ្មី</h4>
<hr />
<Form action="?/create_brand" method="POST">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មោះប្រេនទំនិញ</label>
		{#if get_brand?.id}
			<input type="hidden" name="brand_id" value={get_brand.id} />
		{/if}
		<input
			bind:value={brand_name}
			type="text"
			class="form-control"
			name="brand_name"
			id="brand_name"
			placeholder="បញ្ជូលឈ្មោះប្រេនទំនិញ"
		/>
		<p class="text-danger">
			{form?.message}
		</p>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
