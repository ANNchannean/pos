<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let q = $state('');
</script>

<h4>បង្កើតម៉ាកថ្មី</h4>
<hr />
<form use:enhance action="?/create_brand" method="post">
	<div class="mb-3">
		<label for="exampleFormControlInput1" class="form-label">ឈ្មេាះម៉ាកទំនិញ</label>
		<input
			type="text"
			class="form-control"
			name="brand"
			id="brand"
			placeholder="បញ្ជូលឈ្មេាះម៉ាកទំនិញ"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</form>
