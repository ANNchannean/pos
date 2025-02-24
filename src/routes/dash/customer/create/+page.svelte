<script lang="ts">
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, Snapshot, ActionData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_customer } = $derived(data);
	let form_customer = $state({
		name: data.get_customer?.name,
		address: data.get_customer?.address,
		contact: data.get_customer?.contact,
		picture: ''
	});
	export const snapshot: Snapshot = {
		capture: () => form_customer,
		restore: (value) => (form_customer = value)
	};
</script>

<h4>បញ្ជូលអតិថិជនថ្មី</h4>
<hr />

<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<Form enctype="multipart/form-data" action="?/create_customer" method="POST">
	<div class="mb-3">
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ឈ្មោះអតិថិជន</label>
			{#if get_customer?.id}
				<input type="hidden" name="customer_id" value={get_customer.id} />
			{/if}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				autocomplete="off"
				autofocus
				bind:value={form_customer.name}
				type="text"
				class="form-control"
				name="customer_name"
				id="customer_name"
				placeholder="បញ្ជូលឈ្មោះអតិថិជន"
			/>
			{#if form?.name}
				<p class="text-danger">សូមបញ្ជូលឈ្មោះអតិថិជន</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">អាស័យដ្នាន</label>

			<input
				autocomplete="off"
				bind:value={form_customer.address}
				type="text"
				class="form-control"
				name="customer_address"
				id="customer_address"
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
				bind:value={form_customer.contact}
				type="text"
				class="form-control"
				name="customer_contact"
				id="customer_contact"
				placeholder="បញ្ជូលទំនាក់ទំនង"
			/>
			{#if form?.contact}
				<p class="text-danger">សូមបញ្ជូលទំនាក់ទំនង</p>
			{/if}
		</div>
		<label for="exampleFormControlInput1" class="form-label">រូបភាព</label>
		<input
			type="file"
			accept="image/*"
			class="form-control"
			name="picture"
			id="picture"
			placeholder="បញ្ជូលឈ្មោះអតិថិជន"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
