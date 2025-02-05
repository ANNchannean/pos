<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let q = $state('');
</script>

<h4>បញ្ជីផលិតផល</h4>
<hr />
<div class="row">
	<div class="col-4">
		<form data-sveltekit-keepfocus action="?/search" method="get">
			<input
				bind:value={q}
				name="q"
				placeholder="ស្វែងរកតាមរយឈ្មេាះ..."
				type="search"
				class="form-control"
			/>
		</form>
	</div>
	<div class="col-4">
		<button class="btn btn-warning">បង្កើតថ្មី</button>
	</div>
</div>
<table class="table">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">ឈ្មេាះទំនិញ</th>
			<th scope="col">ប្រភេទទំនិញ</th>
			<th scope="col">ម៉ាកទំនិញ</th>
		</tr>
	</thead>
	<tbody> </tbody>
</table>
