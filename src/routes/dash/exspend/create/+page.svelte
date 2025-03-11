<script lang="ts">
	import { localFormat } from '$lib/client/helper';
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, Snapshot, ActionData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_exspend } = $derived(data);
	let form_exspend = $state({
		amount: data.get_exspend?.amount,
		created_at: localFormat.datetime(data.get_exspend?.created_at),
		reason: data.get_exspend?.reason
	});
	export const snapshot: Snapshot = {
		capture: () => form_exspend,
		restore: (value) => (form_exspend = value)
	};
</script>

<h4>បញ្ជូលពត៌មានការចំណាយ</h4>
<hr />
{get_exspend?.created_at}
<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<Form action="?/create_exspend" method="POST">
	<div class="mb-3">
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ចំនួនទឹកប្រាក់</label>
			{#if get_exspend?.id}
				<input type="hidden" name="exspend_id" value={get_exspend.id} />
			{/if}
			<!-- svelte-ignore a11y_autofocus -->
			<input
				autocomplete="off"
				autofocus
				bind:value={form_exspend.amount}
				type="number"
				step="any"
				class="form-control"
				name="amount"
				id="amount"
				placeholder="$"
			/>
			{#if form?.amount}
				<p class="text-danger">សូមបញ្ជូលចំនួនទឹកប្រាក់</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">កាលបរិច្ឋេទចំណាយ</label>
			<input
				autocomplete="off"
				bind:value={form_exspend.created_at}
				type="datetime-local"
				class="form-control"
				name="datetime"
				id="datetime"
				placeholder="01-01-20.."
			/>
			{#if form?.datetime}
				<p class="text-danger">សូមបញ្ជូលថកាលបរិច្ឋេទចំណាយ</p>
			{/if}
		</div>
		<div class="mb-2">
			<label for="exampleFormControlInput1" class="form-label">ចំណាយលើ</label>

			<textarea
				rows="3"
				class="form-control"
				name="reason"
				id="reason"
				placeholder="ហេតុផល់ចំណាយ"
				bind:value={form_exspend.reason}
			></textarea>
		</div>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
