<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let { get_category } = $derived(data);
</script>

<h4>បង្កើតម៉ាកថ្មី</h4>
<hr />
<form use:enhance action="?/create_category" method="post">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មេាះម៉ាកទំនិញ</label>
		{#if get_category?.id}
			<input type="hidden" name="category_id" value={get_category.id} />
		{/if}
		<input
			value={get_category?.name}
			type="text"
			class="form-control"
			name="category_name"
			id="category_name"
			placeholder="បញ្ជូលឈ្មេាះម៉ាកទំនិញ"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</form>
