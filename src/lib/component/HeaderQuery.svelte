<script lang="ts">
	import { page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
	}
	let { children, class: klass="row g-1" }: Props = $props();

	let page_: number | string = $derived(page.url.searchParams.get('page') || '');
	let limit: number | string = $derived(page.url.searchParams.get('limit') || '');
	let emr = $derived(page.url.searchParams.has('emr') || '');
</script>

<form
	data-sveltekit-keepfocus
	onchange={({ currentTarget }) => {
		currentTarget.requestSubmit();
	}}
	class={klass}
>
	{#if page_}
		<input type="hidden" name="page" value={page_} />
	{/if}
	{#if limit}
		<input type="hidden" name="limit" value={limit} />
	{/if}
	{#if emr}
		<input type="hidden" name="emr" />
	{/if}
	{@render children?.()}
</form>
