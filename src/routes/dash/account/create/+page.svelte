<script lang="ts">
	import Form from '$lib/component/Form.svelte';
	import type { PageServerData, Snapshot, ActionData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let { get_user } = $derived(data);
	let form_user = $state({
		username: data.get_user?.username,
		address: data.get_user?.address,
		contact: data.get_user?.contact,
		role: data.get_user?.role
	});
	export const snapshot: Snapshot = {
		capture: () => form_user,
		restore: (value) => (form_user = value)
	};
	let check_password = $state('');
</script>

<h4>បញ្ជូលអតិថិជនថ្មី</h4>
<hr />

<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<Form action="?/register" method="POST">
	<div class="mb-3">
		<div class="mb-2">
			<label for="username" class="form-label">ឈ្មោះបុគ្គលិក</label>
			{#if get_user?.id}
				<input type="hidden" name="user_id" value={get_user.id} />
			{/if}

			<input
				autocomplete="off"
				bind:value={form_user.username}
				type="text"
				class="form-control"
				name="username"
				id="username"
				placeholder="បញ្ជូលឈ្មោះបុគ្គលិក"
			/>
		</div>

		<div class="mb-2">
			<label for="password" class="form-label">
				{#if !get_user?.id}
					ពាក្យសម្ងាត់
					{:else}
					ពាក្យសម្ងាត់ថ្មី
					{/if}	
			</label>

			<input
				bind:value={check_password}
				autocomplete="off"
				required
				type="password"
				class={check_password ? 'form-control' : 'form-control is-invalid'}
				name="password"
				id="password"
				placeholder="*****"
			/> {check_password}
		</div>
		<div class="mb-2">
			<label for="role" class="form-label">សិទ្ធ</label>

				<select class="form-control" name="role" id="role">
					<option value="admin">Admin</option>
					<option value="cashier">Cashier</option>
				</select>
		</div>

		<div class="mb-2">
			<label for="address" class="form-label">អាស័យដ្នាន</label>

			<input
				autocomplete="off"
				bind:value={form_user.address}
				type="text"
				class="form-control"
				name="address"
				id="address"
				placeholder="បញ្ជូលអាស័យដ្នាន"
			/>
		</div>
		<div class="mb-2">
			<label for="contact" class="form-label">ទំនាក់ទំនង</label>
			<input
				autocomplete="off"
				bind:value={form_user.contact}
				type="text"
				class="form-control"
				name="contact"
				id="contact"
				placeholder="បញ្ជូលទំនាក់ទំនង"
			/>
		</div>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</Form>
