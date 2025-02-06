<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	//  មានតួនាទីចាប់ទិន្ន័យពី Server
	let { data }: { data: PageServerData } = $props();
	let { get_category } = $derived(data);
</script>

<h4>បង្កើតផលិតផលថ្មី</h4>
<hr />

<!-- មានតួនាទីធ្វើសំណើរទៅកាន់ Server  -->
<form use:enhance action="?/create_category" method="post">
	<div class="mb-3">
		<label for="product_name" class="form-label">ឈ្មេាះផលិតផល</label>
		<input
			type="text"
			class="form-control"
			name="product_name"
			id="product_name"
			placeholder="បញ្ជូលឈ្មេាះផលិតផល"
		/>
	</div>
	<div class="mb-3">
		<label for="barcode" class="form-label">បាកូដ</label>
		<input
			type="text"
			class="form-control"
			name="barcode"
			id="barcode"
			placeholder="បញ្ជូលបាកូដ(មិនអាចដូចគ្នា)"
		/>
	</div>
	<div class="mb-3">
		<label for="price" class="form-label">តម្លៃ</label>
		<input
			type="text"
			class="form-control"
			name="price"
			id="price"
			placeholder="តម្លៃត្រូវតែធំជាងសូន្យ"
		/>
	</div>
	<div>
		<button class="btn btn-warning float-end" type="submit">រក្សាទុក្ខ</button>
	</div>
</form>
