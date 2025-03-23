<script lang="ts">
	import { browser } from '$app/environment';
	import type { EventHandler } from 'svelte/elements';
	let { q_name = 'q', value = $bindable('') }: { q_name?: string; value?: string } = $props();
	let timeout: number | NodeJS.Timeout | null = $state(null);
	const handleQ: EventHandler<Event, HTMLInputElement> = ({ currentTarget }) => {
		clearTimeout(timeout!);
		const form = currentTarget?.form;
		if (!form) return;
		timeout = setTimeout(() => {
			form.requestSubmit();
		}, 400);
	};
	$effect(() => {
		if (value) {
			if (browser) {
				(document?.getElementById('search') as HTMLInputElement)?.form?.requestSubmit();
				value = '';
			}
		}
	});
</script>

<input
	autocomplete="off"
	oninput={handleQ}
	type="search"
	name={q_name}
	{value}
	class="form-control"
	placeholder="ស្វែងរក..."
	id="search"
/>
