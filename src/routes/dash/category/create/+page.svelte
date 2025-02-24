<script lang="ts">
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, Snapshot,ActionData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data,form }: { data: PageServerData,form:ActionData } = $props();
	let { get_category } = $derived(data);
	let category_name = $state(data?.get_category?.name ?? '');
	export const snapshot: Snapshot<string> = {
		capture: () => category_name,
		restore: (value) => (category_name = value)
	};
</script>

<h4>បង្កើតប្រេនថ្មី</h4>
<hr />

<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<Form action="?/create_category" method="POST">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មោះប្រេនទំនិញ</label>
		{#if get_category?.id}
			<input type="hidden" name="category_id" value={get_category.id} />
		{/if}
		<!-- svelte-ignore a11y_autofocus -->
		<input
			autocomplete="off"
			autofocus
			bind:value={category_name}
			type="text"
			class="form-control"
			name="category_name"
			id="category_name"
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
