<script lang="ts">
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, Snapshot, ActionData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_supplier } = $derived(data);
	let form_supplier = $state({
		name: data.get_supplier?.name,
		address: data.get_supplier?.address,
		contact: data.get_supplier?.contact,
		company_name: data.get_supplier?.company_name
	});
	export const snapshot: Snapshot = {
		capture: () => form_supplier,
		restore: (value) => (form_supplier = value)
	};
</script>

<h4>បញ្ជូលអ្នកផ្គត់ផ្គង់ថ្មី</h4>
<hr />

<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<Form enctype="multipart/form-data" action="?/create_supplier" method="POST">
	<div class="mb-3">
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ឈ្មោះអ្នកផ្គត់ផ្គង់</label>
			{#if get_supplier?.id}
				<input type="hidden" name="supplier_id" value={get_supplier.id} />
			{/if}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				autocomplete="off"
				autofocus
				bind:value={form_supplier.name}
				type="text"
				class="form-control"
				name="supplier_name"
				id="supplier_name"
				placeholder="បញ្ជូលឈ្មោះអ្នកផ្គត់ផ្គង់"
			/>
			{#if form?.name}
				<p class="text-danger">សូមបញ្ជូលឈ្មោះអ្នកផ្គត់ផ្គង់</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">អាស័យដ្នាន</label>

			<input
				autocomplete="off"
				bind:value={form_supplier.address}
				type="text"
				class="form-control"
				name="supplier_address"
				id="supplier_address"
				placeholder="បញ្ជូលអាស័យដ្នាន"
			/>

			{#if form?.adddress}
				<p class="text-danger">សូមបញ្ជូលអាស័ដ្ឋាន</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ទំនាក់ទំនង</label>
			<input
				autocomplete="off"
				bind:value={form_supplier.contact}
				type="text"
				class="form-control"
				name="supplier_contact"
				id="supplier_contact"
				placeholder="បញ្ជូលទំនាក់ទំនង"
			/>
			{#if form?.contact}
				<p class="text-danger">សូមបញ្ជូលទំនាក់ទំនង</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ក្រុមហ៊ុន</label>
			<input
				autocomplete="off"
				bind:value={form_supplier.company_name}
				type="text"
				class="form-control"
				name="supplier_company_name"
				id="supplier_company_name"
				placeholder="បញ្ជូលក្រុមហ៊ុន"
			/>
			{#if form?.company_name}
				<p class="text-danger">សូមបញ្ជូលក្រុមហ៊ុន</p>
			{/if}
		</div>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
