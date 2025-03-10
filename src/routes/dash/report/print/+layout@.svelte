<script lang="ts">
	import type { LayoutServerData } from './$types';
	interface Props {
		data: LayoutServerData;
		children?: import('svelte').Snippet;
	}
	let { children }: Props = $props();
	function handlePrint() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setTimeout(() => {
			window.print();
		}, 10); // Adjust the timeout as needed
		window.history.back();
	}
	function back() {
		window.history.back();
	}
</script>

<div class="main">
	<div class="row g-0 sticky-top">
		<div class="col-auto">
			<button
				onclick={back}
				class="text-center rounded-0 w-100 mt-1 mb-1 btn btn-warning btn-lg d-print-none text-decoration-none"
				><i class="fa-solid fa-arrow-left"></i> ទំព័រដើម</button
			>
		</div>
		<div class="col">
			<button
				onclick={handlePrint}
				class="text-center rounded-0 w-100 mt-1 mb-1 btn btn-primary btn-lg d-print-none text-decoration-none"
			>
				<i class="fa-solid fa-print"></i>
				បោះពុម្ភវិក្កយបត្រ
			</button>
		</div>
	</div>

	{@render children?.()}
</div>

<style>
	/* @page {
		@bottom-right {
			content: counter(page) '/' counter(pages);
			padding-bottom: 5mm; 
		}
	} */
	.main {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
