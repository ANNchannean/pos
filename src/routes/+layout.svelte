<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';

	let { children }: { data: LayoutServerData; children: Snippet } = $props();
</script>

{@render children()}
