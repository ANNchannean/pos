<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_unit } = $derived(data);
	let q = $state('');
</script>

<h4>បង្កើតខ្នាតថ្មី</h4>
<hr />
<form use:enhance action="?/create_unit" method="post">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មេាះខ្នាតទំនិញ</label>
		{#if get_unit?.id}
			<input type="hidden" name="unit_id" value={get_unit.id} />
		{/if}
		<input
			value={get_unit?.name}
			type="text"
			class="form-control"
			name="unit_name"
			id="unit_name"
			placeholder="បញ្ជូលឈ្មេាះខ្នាតទំនិញ"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</form>
