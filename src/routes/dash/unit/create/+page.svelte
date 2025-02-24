<script lang="ts">
	import Form from '$lib/component/Form.svelte';


	import type { PageServerData, Snapshot, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_unit } = $derived(data);

	let unit_name = $state(data?.get_unit?.name ?? '');
	export const snapshot: Snapshot<string> = {
		capture: () => unit_name,
		restore: (value) => (unit_name = value)
	};
</script>

<h4>បង្កើតខ្នាតថ្មី</h4>
<hr />
<Form action="?/create_unit" method="POST">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មោះខ្នាតទំនិញ</label>
		{#if get_unit?.id}
			<input type="hidden" name="unit_id" value={get_unit.id} />
		{/if}
		<input
			value={get_unit?.name}
			type="text"
			class="form-control"
			name="unit_name"
			id="unit_name"
			placeholder="បញ្ជូលឈ្មោះខ្នាតទំនិញ"
		/>
		<p class="text-danger">
			{form?.message}
		</p>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
